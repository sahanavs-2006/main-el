import subprocess
import sys
import os
import logging
import signal
from contextlib import contextmanager
import threading
import time
from typing import Optional, List

import requests

logger = logging.getLogger(__name__)

class TimeoutException(Exception):
    """Raised when code execution times out."""
    pass

class CodeExecutor:
    """
    Safely executes Python code with timeout and output capture.
    Prevents dangerous operations and limits resource usage.
    """
    
    # Forbidden imports and functions that could harm the system
    FORBIDDEN_PATTERNS = [
        'import os', 'os.', 'subprocess', 'sys.exit', '__import__',
        'eval', 'exec', 'compile', 'open', 'quit', 'exit',
        'socket', 'urllib', 'requests', 'http', 'ftplib', 'smtplib'
    ]
    
    def __init__(self, timeout=10, max_output=10000, judge0_url: Optional[str] = None, judge0_api_key: Optional[str] = None):
        """
        Initialize the executor.
        
        Args:
            timeout (int): Maximum execution time in seconds
            max_output (int): Maximum output size in characters
            judge0_url (str): Base URL of Judge0 API (e.g., http://localhost:2358)
            judge0_api_key (str): Optional API key for Judge0 (X-Auth-Token)
        """
        self.timeout = timeout
        self.max_output = max_output
        self.judge0_url = judge0_url or os.getenv('JUDGE0_URL', '').strip()
        self.judge0_api_key = judge0_api_key or os.getenv('JUDGE0_API_KEY', '').strip()

    def has_judge0(self) -> bool:
        return bool(self.judge0_url)

    def execute_via_judge0(self, code: str, inputs: Optional[List[str]] = None, language_id: int = 71) -> dict:
        """
        Execute code using a Judge0 instance if configured.

        Args:
            code: Source code to run
            inputs: List of stdin values (joined with newlines)
            language_id: Judge0 language id (71 = Python 3)
        Returns:
            dict with status/output/error/execution_time
        """
        if not self.judge0_url:
            return {'status': 'unavailable', 'output': '', 'error': 'Judge0 URL not configured', 'execution_time': 0}

        url = self.judge0_url.rstrip('/') + '/submissions/?wait=true'
        payload = {
            'source_code': code,
            'language_id': language_id,
            'stdin': '\n'.join(inputs or []),
        }

        headers = {'Content-Type': 'application/json'}
        if self.judge0_api_key:
            headers['X-Auth-Token'] = self.judge0_api_key

        start_time = time.time()
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=self.timeout + 5)
            if not resp.ok:
                return {
                    'status': 'error',
                    'output': '',
                    'error': f'Judge0 error {resp.status_code}: {resp.text[:200]}',
                    'execution_time': time.time() - start_time
                }

            data = resp.json() or {}
            status_obj = data.get('status', {})
            status_id = status_obj.get('id')
            status_desc = status_obj.get('description', '')

            output = data.get('stdout') or ''
            error = data.get('stderr') or data.get('compile_output') or ''

            status_str = 'success'
            if status_id == 5:
                status_str = 'timeout'
            elif status_id not in (3,):
                status_str = 'error'

            return {
                'status': status_str,
                'output': output[:self.max_output],
                'error': error[:self.max_output] if error else (status_desc if status_str == 'error' else ''),
                'execution_time': time.time() - start_time
            }

        except requests.RequestException as e:
            return {
                'status': 'unavailable',
                'output': '',
                'error': f'Judge0 unavailable: {str(e)}',
                'execution_time': time.time() - start_time
            }
    
    def is_code_safe(self, code: str) -> bool:
        """
        Check if code contains forbidden patterns.
        
        Args:
            code (str): Python code to check
            
        Returns:
            bool: True if code appears safe, False otherwise
        """
        code_lower = code.lower()
        
        for pattern in self.FORBIDDEN_PATTERNS:
            if pattern.lower() in code_lower:
                logger.warning(f"Forbidden pattern detected: {pattern}")
                return False
        
        return True
    
    def execute_code(self, code: str, inputs=None) -> dict:
        """
        Execute Python code safely with timeout.
        
        Args:
            code (str): Python code to execute
            
        Returns:
            dict: Execution result with status, output, and errors
        """
        # Safety check
        if not self.is_code_safe(code):
            return {
                'status': 'error',
                'output': '',
                'error': 'Code contains forbidden operations',
                'execution_time': 0
            }
        
        # Prepare execution environment
        input_queue = list(inputs or [])

        def safe_input(prompt: str = ''):
            if input_queue:
                return str(input_queue.pop(0))
            # Fallback to empty string to avoid blocking
            return ''

        safe_globals = {
            '__builtins__': {
                'print': print,
                'range': range,
                'len': len,
                'str': str,
                'int': int,
                'float': float,
                'list': list,
                'dict': dict,
                'tuple': tuple,
                'set': set,
                'bool': bool,
                'sum': sum,
                'max': max,
                'min': min,
                'sorted': sorted,
                'enumerate': enumerate,
                'zip': zip,
                'map': map,
                'filter': filter,
                'abs': abs,
                'round': round,
                'pow': pow,
                'divmod': divmod,
                'input': safe_input,
            }
        }
        
        output = []
        errors = []
        execution_time = 0
        
        # Redirect stdout to capture output
        from io import StringIO
        import time
        
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        sys.stdout = StringIO()
        sys.stderr = StringIO()
        
        try:
            start_time = time.time()
            
            # Execute with timeout
            exec(code, safe_globals)
            
            execution_time = time.time() - start_time
            
            output_text = sys.stdout.getvalue()
            error_text = sys.stderr.getvalue()
            
            output = output_text[:self.max_output]
            errors = error_text[:self.max_output] if error_text else ''
            
            return {
                'status': 'success',
                'output': output.strip(),
                'error': errors.strip() if errors else '',
                'execution_time': round(execution_time, 3)
            }
        
        except TimeoutError:
            return {
                'status': 'timeout',
                'output': sys.stdout.getvalue()[:self.max_output],
                'error': f'Execution exceeded {self.timeout} seconds',
                'execution_time': self.timeout
            }
        
        except SyntaxError as e:
            return {
                'status': 'error',
                'output': '',
                'error': f'Syntax error: {str(e)}',
                'execution_time': time.time() - start_time if 'start_time' in locals() else 0
            }
        
        except Exception as e:
            return {
                'status': 'error',
                'output': sys.stdout.getvalue()[:self.max_output],
                'error': f'{type(e).__name__}: {str(e)}',
                'execution_time': time.time() - start_time if 'start_time' in locals() else 0
            }
        
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

# Global executor instance
executor = CodeExecutor()
