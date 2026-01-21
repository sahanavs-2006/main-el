import requests
import os
import logging
import re
from typing import Optional, Dict

logger = logging.getLogger(__name__)

class CodeT5Generator:
    """
    Generates Python code from natural language descriptions using CodeT5.
    Uses your self-trained HuggingFace model via Inference API.
    """
    
    def __init__(self, hf_token=None, hf_repo_id=None):
        """
        Initialize the CodeT5 generator with local transformers pipeline or API fallback.
        """
        self.hf_token = hf_token or os.getenv('HF_TOKEN', '')
        self.hf_repo_id = hf_repo_id or os.getenv('HF_REPO_ID', 'Salesforce/codet5-base')
        self.api_url = f"https://api-inference.huggingface.co/models/{self.hf_repo_id}"
        
        try:
            from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
            logger.info(f"Loading model and tokenizer from {self.hf_repo_id} ...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.hf_repo_id)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(self.hf_repo_id)
            self.pipeline = pipeline("text2text-generation", model=self.model, tokenizer=self.tokenizer)
            logger.info(f"✓ CodeT5 generator loaded locally: {self.hf_repo_id}")
        except Exception as e:
            logger.warning(f"Local model loading failed (might be environment constraints): {e}")
            logger.info("Will attempt to use HuggingFace Inference API if HF_TOKEN is provided.")
            self.pipeline = None
    
    def generate_code(self, description: str, max_length: int = 256) -> Dict:
        """
        Generate Python code from natural language description using local HuggingFace model.
        """
        if not description or not description.strip():
            return {'error': 'Empty description', 'code': ''}
            
        enhanced_description = f"Translate English to Python: {description}"
        generated_text = ""
        
        if self.pipeline:
            try:
                result = self.pipeline(enhanced_description, max_length=max_length, truncation=True)
                generated_text = result[0]['generated_text'] if result and 'generated_text' in result[0] else ""
            except Exception as e:
                logger.error(f"Local generation failed: {e}")
        
        # Fallback to Inference API if local failed or pipeline is not loaded
        if not generated_text and self.hf_token:
            try:
                headers = {"Authorization": f"Bearer {self.hf_token}"}
                payload = {"inputs": enhanced_description, "parameters": {"max_new_tokens": max_length}}
                response = requests.post(self.api_url, headers=headers, json=payload, timeout=20)
                if response.status_code == 200:
                    res_json = response.json()
                    if isinstance(res_json, list) and len(res_json) > 0:
                        generated_text = res_json[0].get('generated_text', '')
                    elif isinstance(res_json, dict):
                        generated_text = res_json.get('generated_text', '')
                    logger.info("Generated code using HuggingFace Inference API")
            except Exception as e:
                logger.error(f"HF Inference API call failed: {e}")

        try:
            # Clean up generated code from common hallucinations
            cleaned_code = self._clean_generated_text(generated_text)
            
            # Additional heuristic logic to ensure correctness for common patterns
            complete_code = self._complete_code_with_assignments(description, cleaned_code)
            
            # If both model and heuristics failed to produce code
            if not complete_code.strip():
                return {
                    'error': 'Code generation failed. Please try a different description.',
                    'code': '',
                    'description': description,
                    'status': 'error'
                }

            logger.info(f"Generated code (final): {complete_code[:100]}")
            return {
                'code': complete_code,
                'description': description,
                'model': self.hf_repo_id,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Post-processing error: {str(e)}")
            return {
                'error': f"Generation failed during processing: {str(e)}",
                'code': '',
                'description': description
            }

    def _clean_generated_text(self, text: str) -> str:
        """
        Clean up model hallucinations like 'def generate_python_code():', Java boilerplate, or leading dots.
        """
        if not text:
            return text
            
        # Remove Java/C#/C++ wrapper patterns
        text = re.sub(r'^[.\s]*public\s+class\s+[a-zA-Z_]\w*.*?\s*\{', '', text, flags=re.DOTALL)
        text = re.sub(r'^[.\s]*static\s+void\s+main.*?\s*\{', '', text, flags=re.DOTALL)
        text = re.sub(r'System\.out\.println\s*\((.*?)\);?', r'print(\1)', text)
        
        # Remove common Python wrapper patterns
        text = re.sub(r'^[.\s]*def\s+[a-zA-Z_]\w*\s*\(.*?\)\s*:\s*', '', text)
        text = re.sub(r'^[.\s]*class\s+[a-zA-Z_]\w*\s*:\s*', '', text)
        
        # Remove leading dots, spaces, or weird characters
        text = text.lstrip('. \n\t')
        
        # Remove trailing braces if they seem like boilerplate (Java influence)
        if text.endswith('}') and not '{' in text:
             text = text.rstrip('} \n\t')
             
        return text.strip()
    
    # REMOVED: _generate_with_hf_api (no longer needed for local inference)
    
    def _complete_code_with_assignments(self, description: str, generated_code: str) -> str:
        """
        Extract variable assignments from description and prepend to generated code.
        Handles patterns like: "Assign 5 to A", "Start sum as 0", etc.
        """
        # Extract all assignment patterns from description
        assignments = []
        
        # Pattern 1: "Assign <value> to <variable>"
        pattern1 = r'assign\s+(\d+)\s+to\s+([a-zA-Z_]\w*)'
        matches1 = re.findall(pattern1, description, re.IGNORECASE)
        for value, var in matches1:
            assignments.append(f"{var} = {value}")
        
        # Pattern 2: "Start <variable> as <value>" or "Initialize <variable> as/to <value>"
        pattern2 = r'(?:start|initialize)\s+([a-zA-Z_]\w*)\s+(?:as|to|with)\s+(\d+)'
        matches2 = re.findall(pattern2, description, re.IGNORECASE)
        for var, value in matches2:
            assignment = f"{var} = {value}"
            if assignment not in assignments:
                assignments.append(assignment)
        
        # Pattern 3: "<variable> = <value>"
        pattern3 = r'([a-zA-Z_]\w*)\s*=\s*(\d+)'
        matches3 = re.findall(pattern3, description)
        for var, value in matches3:
            assignment = f"{var} = {value}"
            if assignment not in assignments:
                assignments.append(assignment)
        
        # Check for common algorithm patterns and add complete implementations
        complete_code = self._add_algorithm_logic(description, generated_code, assignments)
        
        # If no algorithm logic was added, just prepend missing assignments
        if complete_code == generated_code and assignments:
            code_lines = generated_code.strip().split('\n')
            # Check if assignments are already in the code
            existing_vars = set()
            for line in code_lines:
                var_match = re.match(r'^([a-zA-Z_]\w*)\s*=', line.strip())
                if var_match:
                    existing_vars.add(var_match.group(1))
            
            # Add missing assignments
            missing_assignments = [a for a in assignments if a.split('=')[0].strip() not in existing_vars]
            
            if missing_assignments:
                complete_code = '\n'.join(missing_assignments) + '\n' + generated_code
                logger.info(f"Added missing assignments: {missing_assignments}")
        
        return complete_code
    
    def _add_algorithm_logic(self, description: str, generated_code: str, assignments: list) -> str:
        """
        Detect common algorithm patterns and add complete logic if missing.
        """
        desc_lower = description.lower()
        
        # If code looks like non-python boilerplate, ignore it
        if ('public class' in generated_code or 'static void main' in generated_code or '{' in generated_code):
            generated_code = ""

        # Find N variable from assignments (preserve case)
        actual_n_var = None
        for assignment in assignments:
            var_name = assignment.split('=')[0].strip()
            if var_name.lower() in ['n', 'num', 'number']:
                actual_n_var = var_name
                break
        
        # Check if loop logic is already present
        has_loop = any(keyword in generated_code for keyword in ['for', 'while', 'range'])
        
        # Pattern: Sum-related algorithm with range (1 to N, from 1 to N, etc.)
        has_sum = 'sum' in desc_lower
        has_range = re.search(r'(?:from\s+)?1\s+to\s+([a-zA-Z_]\w*)', desc_lower)
        has_find_sum = 'find' in desc_lower or 'calculate' in desc_lower or 'compute' in desc_lower
        
        if not has_loop and has_sum and (has_range or has_find_sum) and actual_n_var:
            # Build complete sum algorithm
            code_parts = []
            code_parts.extend(assignments)
            
            # Add sum initialization if not already present
            sum_var = 'sum'
            if not any(f'{sum_var} = 0' in a or f'{sum_var}=0' in a for a in assignments):
                code_parts.append(f'{sum_var} = 0')
            
            # Add loop
            code_parts.append(f'for i in range(1, {actual_n_var} + 1):')
            code_parts.append(f'    {sum_var} += i')
            code_parts.append(f'print({sum_var})')
            
            logger.info(f"Added complete sum algorithm (1 to {actual_n_var})")
            return '\n'.join(code_parts)
        
        # Pattern: Write/Define a function to find the sum of two numbers
        if ('function' in desc_lower) and has_sum and ('two' in desc_lower and ('number' in desc_lower or 'numbers' in desc_lower)):
            # Determine parameter names from assignments if available
            params = []
            for assignment in assignments:
                var_name = assignment.split('=')[0].strip()
                # collect only non-sum variables
                if var_name.lower() not in ['sum'] and var_name not in params:
                    params.append(var_name)
            
            # Choose two parameter names
            if len(params) >= 2:
                a_name, b_name = params[0], params[1]
            else:
                a_name, b_name = 'a', 'b'
            
            code_parts = []
            # Function definition
            code_parts.append(f'def sum_two_numbers({a_name}, {b_name}):')
            code_parts.append(f'    return {a_name} + {b_name}')
            
            # Example usage: if we have assignments for two variables, include them; otherwise add simple demo
            example_lines = []
            # Map assignments by var
            assign_map = {}
            for a in assignments:
                var, val = [x.strip() for x in a.split('=')]
                assign_map[var] = val
            
            if a_name in assign_map and b_name in assign_map:
                example_lines.append(f'print(sum_two_numbers({a_name}, {b_name}))')
            elif len(assign_map) >= 2:
                keys = list(assign_map.keys())
                example_lines.append(f'{keys[0]} = {assign_map[keys[0]]}')
                example_lines.append(f'{keys[1]} = {assign_map[keys[1]]}')
                example_lines.append(f'print(sum_two_numbers({keys[0]}, {keys[1]}))')
            else:
                example_lines.append(f'print(sum_two_numbers(5, 7))')
            
            code_parts.extend(example_lines)
            logger.info("Added function to compute sum of two numbers with example usage")
            return '\n'.join(code_parts)

        # Pattern: Add two variables / numbers and print result
        if ('add' in desc_lower or 'sum' in desc_lower) and (('two variables' in desc_lower) or ('two numbers' in desc_lower)):
            code_parts = []
            # gather variable names from assignments
            vars_from_assign = [a.split('=')[0].strip() for a in assignments]
            if len(vars_from_assign) >= 2:
                a_var, b_var = vars_from_assign[0], vars_from_assign[1]
            else:
                a_var, b_var = 'a', 'b'
                if not assignments:
                    assignments.extend([
                        f"{a_var} = int(input('Enter first number: '))",
                        f"{b_var} = int(input('Enter second number: '))"
                    ])

            code_parts.extend(assignments)
            result_var = 'result'
            code_parts.append(f'{result_var} = {a_var} + {b_var}')
            code_parts.append(f'print({result_var})')
            logger.info(f"Added add-two-numbers logic using {a_var}, {b_var}")
            return '\n'.join(code_parts)
        
        # Pattern: Multiply two variables / numbers and print result
        if ('multiply' in desc_lower or 'product' in desc_lower) and (('two variables' in desc_lower) or ('two numbers' in desc_lower) or 'of' in desc_lower):
            code_parts = []
            # gather variable names from assignments
            vars_from_assign = [a.split('=')[0].strip() for a in assignments]
            if len(vars_from_assign) >= 2:
                a_var, b_var = vars_from_assign[0], vars_from_assign[1]
            else:
                a_var, b_var = 'a', 'b'
                if not assignments:
                    assignments.extend([
                        f"{a_var} = int(input('Enter first number: '))",
                        f"{b_var} = int(input('Enter second number: '))"
                    ])

            code_parts.extend(assignments)
            result_var = 'result'
            code_parts.append(f'{result_var} = {a_var} * {b_var}')
            code_parts.append(f'print({result_var})')
            logger.info(f"Added multiply-two-numbers logic using {a_var}, {b_var}")
            return '\n'.join(code_parts)
        
        # Pattern: Divide two variables / numbers and print result
        if ('divide' in desc_lower or 'division' in desc_lower) and (('by' in desc_lower) or ('two' in desc_lower)):
            code_parts = []
            # gather variable names from assignments
            vars_from_assign = [a.split('=')[0].strip() for a in assignments]
            if len(vars_from_assign) >= 2:
                a_var, b_var = vars_from_assign[0], vars_from_assign[1]
            else:
                a_var, b_var = 'a', 'b'
                if not assignments:
                    assignments.extend([
                        f"{a_var} = int(input('Enter first number: '))",
                        f"{b_var} = int(input('Enter second number: '))"
                    ])

            code_parts.extend(assignments)
            result_var = 'result'
            code_parts.append(f'{result_var} = {a_var} / {b_var}')
            code_parts.append(f'print({result_var})')
            logger.info(f"Added divide-two-numbers logic using {a_var}, {b_var}")
            return '\n'.join(code_parts)
        
        # Pattern: Subtract two variables / numbers and print result
        if ('subtract' in desc_lower or 'minus' in desc_lower or 'difference' in desc_lower) and (('from' in desc_lower) or ('two' in desc_lower)):
            code_parts = []
            # gather variable names from assignments
            vars_from_assign = [a.split('=')[0].strip() for a in assignments]
            if len(vars_from_assign) >= 2:
                a_var, b_var = vars_from_assign[0], vars_from_assign[1]
            else:
                a_var, b_var = 'a', 'b'
                if not assignments:
                    assignments.extend([
                        f"{a_var} = int(input('Enter first number: '))",
                        f"{b_var} = int(input('Enter second number: '))"
                    ])

            code_parts.extend(assignments)
            result_var = 'result'
            code_parts.append(f'{result_var} = {a_var} - {b_var}')
            code_parts.append(f'print({result_var})')
            logger.info(f"Added subtract-two-numbers logic using {a_var}, {b_var}")
            return '\n'.join(code_parts)
        
        # Pattern: Print even numbers within a range (e.g., 1 to 10, from 1 to N)
        if ('even' in desc_lower) and (not has_loop):
            start_expr, end_expr = self._extract_range(description, assignments)
            if end_expr:
                code_parts = []
                code_parts.extend(assignments)
                code_parts.append(f'for i in range({start_expr or 1}, {end_expr} + 1):')
                code_parts.append('    if i % 2 == 0:')
                code_parts.append('        print(i)')
                logger.info(f"Added even-number range printing from {start_expr or 1} to {end_expr}")
                return '\n'.join(code_parts)

        # Pattern: Handle generic print of a text/variable
        if desc_lower.startswith('print') or 'print' in desc_lower:
            # Simple print "something"
            string_match = re.search(r'print\s+(?:["\'])(.*?)(?:["\'])', description, re.IGNORECASE)
            if string_match:
                return f'print("{string_match.group(1)}")'
            
            # Simple print hello world (special case for common hallucinations)
            if 'hello world' in desc_lower:
                return 'print("Hello World")'
            
            # Simple print a variable
            var_match = re.search(r'print\s+(?:the\s+)?([a-zA-Z_]\w*)', desc_lower)
            if var_match:
                var_name = var_match.group(1)
                # Ensure variable is initialized or handled
                if any(var_name in a for a in assignments):
                    code_parts = list(assignments)
                    code_parts.append(f'print({var_name})')
                    return '\n'.join(code_parts)
                # If variable not found but it's just "print <word>", maybe it's text
                elif ' ' not in var_name:
                    return f'print({var_name})'

        # Pattern: If-condition (e.g., If a number is 10 then print it)
        if 'if' in desc_lower and ('print' in desc_lower or 'display' in desc_lower or 'output' in desc_lower):
            # Extract variable and condition
            # Pattern: If <var> is <val> then print <it/var>
            match = re.search(r'if\s+(?:a|the)?\s*([a-zA-Z_]\w*|number)\s+(?:is|==|equals|is equal to)\s+(\d+|\"[^\"]+\"|[a-zA-Z_]\w*).*?print', desc_lower)
            if match:
                var_name = match.group(1).strip()
                target_val = match.group(2).strip()
                
                if var_name.lower() in ['number', 'a number']:
                    var_name = 'num'
                
                code_parts = []
                # Check for assignments for this variable
                found_var = False
                for assignment in assignments:
                    if assignment.split('=')[0].strip() == var_name:
                        code_parts.append(assignment)
                        found_var = True
                
                if not found_var:
                    # Default initialization if missing
                    if target_val.isdigit():
                        code_parts.append(f"{var_name} = {target_val}")
                    else:
                        code_parts.append(f"{var_name} = 10  # Example value")
                
                code_parts.append(f"if {var_name} == {target_val}:")
                # Detect what to print
                if 'print it' in desc_lower or f'print {var_name}' in desc_lower:
                    code_parts.append(f"    print({var_name})")
                else:
                    # Check for "print "something""
                    text_match = re.search(r'print\s+["\'](.*?)["\']', description, re.IGNORECASE)
                    if text_match:
                        code_parts.append(f"    print(\"{text_match.group(1)}\")")
                    else:
                        code_parts.append(f"    print({var_name})")
                
                logger.info(f"Added if-condition logic for {var_name}")
                return '\n'.join(code_parts)

        # Pattern: Print odd numbers within a range
        if ('odd' in desc_lower) and (not has_loop):
            start_expr, end_expr = self._extract_range(description, assignments)
            if end_expr:
                code_parts = []
                code_parts.extend(assignments)
                code_parts.append(f'for i in range({start_expr or 1}, {end_expr} + 1):')
                code_parts.append('    if i % 2 != 0:')
                code_parts.append('        print(i)')
                logger.info(f"Added odd-number range printing from {start_expr or 1} to {end_expr}")
                return '\n'.join(code_parts)

        # Pattern: Print all numbers within a range
        if (('print' in desc_lower or 'display' in desc_lower) and ('numbers' in desc_lower or 'values' in desc_lower)) and (not has_loop):
            start_expr, end_expr = self._extract_range(description, assignments)
            if end_expr:
                code_parts = []
                code_parts.extend(assignments)
                code_parts.append(f'for i in range({start_expr or 1}, {end_expr} + 1):')
                code_parts.append('    print(i)')
                logger.info(f"Added generic range printing from {start_expr or 1} to {end_expr}")
                return '\n'.join(code_parts)

        # ========== NEW ENHANCED PATTERNS ==========
        
        # Pattern: While loop (e.g., "while x is less than 10")
        if 'while' in desc_lower and not has_loop:
            # Extract condition
            condition_match = re.search(r'while\\s+([a-zA-Z_]\\w*)\\s+(?:is\\s+)?(?:less than|<)\\s+(\\d+|[a-zA-Z_]\\w*)', desc_lower)
            if condition_match:
                var_name = condition_match.group(1)
                limit = condition_match.group(2)
                code_parts = []
                # Add variable initialization if not present
                if not any(var_name in a for a in assignments):
                    code_parts.append(f"{var_name} = 0")
                code_parts.extend(assignments)
                code_parts.append(f"while {var_name} < {limit}:")
                code_parts.append(f"    print({var_name})")
                code_parts.append(f"    {var_name} += 1")
                logger.info(f"Added while loop for {var_name} < {limit}")
                return '\\n'.join(code_parts)

        # Pattern: For loop with step (e.g., "print numbers from 0 to 10 step 2")
        if ('step' in desc_lower or 'increment' in desc_lower) and not has_loop:
            step_match = re.search(r'step\\s+(\\d+)', desc_lower)
            if step_match:
                step = step_match.group(1)
                start_expr, end_expr = self._extract_range(description, assignments)
                if end_expr:
                    code_parts = []
                    code_parts.extend(assignments)
                    code_parts.append(f'for i in range({start_expr or 0}, {end_expr} + 1, {step}):')
                    code_parts.append('    print(i)')
                    logger.info(f"Added for loop with step {step}")
                    return '\\n'.join(code_parts)

        # Pattern: Countdown/reverse loop (e.g., "print numbers from 10 to 1" or "countdown")
        if ('countdown' in desc_lower or 'reverse' in desc_lower or 'descending' in desc_lower) and not has_loop:
            start_expr, end_expr = self._extract_range(description, assignments)
            # Swap start and end for countdown
            if start_expr and end_expr:
                code_parts = []
                code_parts.extend(assignments)
                code_parts.append(f'for i in range({end_expr}, {start_expr} - 1, -1):')
                code_parts.append('    print(i)')
                logger.info(f"Added countdown loop from {end_expr} to {start_expr}")
                return '\\n'.join(code_parts)

        # ========== INPUT/OUTPUT PATTERNS ==========

        # Pattern: Get user input (e.g., "take input from user", "read a number")
        if ('input' in desc_lower or 'read' in desc_lower or 'take' in desc_lower) and ('user' in desc_lower or 'number' in desc_lower or 'name' in desc_lower):
            if 'number' in desc_lower or 'integer' in desc_lower:
                var_name = 'num'
                code_parts = [f"{var_name} = int(input('Enter a number: '))"]
                code_parts.append(f"print({var_name})")
                logger.info("Added integer input pattern")
                return '\\n'.join(code_parts)
            elif 'name' in desc_lower or 'string' in desc_lower or 'text' in desc_lower:
                var_name = 'name' if 'name' in desc_lower else 'text'
                code_parts = [f"{var_name} = input('Enter {var_name}: ')"]
                code_parts.append(f"print({var_name})")
                logger.info("Added string input pattern")
                return '\\n'.join(code_parts)

        # Pattern: Multiple inputs (e.g., "take two numbers as input")
        if ('two' in desc_lower or 'three' in desc_lower) and ('input' in desc_lower or 'read' in desc_lower):
            count = 2 if 'two' in desc_lower else 3
            code_parts = []
            for i in range(1, count + 1):
                code_parts.append(f"num{i} = int(input('Enter number {i}: '))")
            if 'add' in desc_lower or 'sum' in desc_lower:
                sum_expr = ' + '.join([f'num{i}' for i in range(1, count + 1)])
                code_parts.append(f"result = {sum_expr}")
                code_parts.append("print(result)")
            else:
                for i in range(1, count + 1):
                    code_parts.append(f"print(num{i})")
            logger.info(f"Added {count} inputs pattern")
            return '\\n'.join(code_parts)

        # ========== STRING MANIPULATION PATTERNS ==========

        # Pattern: Reverse a string
        if 'reverse' in desc_lower and 'string' in desc_lower:
            code_parts = []
            code_parts.append("text = input('Enter a string: ')")
            code_parts.append("reversed_text = text[::-1]")
            code_parts.append("print(reversed_text)")
            logger.info("Added string reverse pattern")
            return '\\n'.join(code_parts)

        # Pattern: Convert to uppercase/lowercase
        if ('uppercase' in desc_lower or 'upper' in desc_lower or 'capital' in desc_lower) and 'string' in desc_lower:
            code_parts = []
            code_parts.append("text = input('Enter a string: ')")
            code_parts.append("upper_text = text.upper()")
            code_parts.append("print(upper_text)")
            logger.info("Added uppercase conversion pattern")
            return '\\n'.join(code_parts)
        
        if ('lowercase' in desc_lower or 'lower' in desc_lower or 'small' in desc_lower) and 'string' in desc_lower:
            code_parts = []
            code_parts.append("text = input('Enter a string: ')")
            code_parts.append("lower_text = text.lower()")
            code_parts.append("print(lower_text)")
            logger.info("Added lowercase conversion pattern")
            return '\\n'.join(code_parts)

        # Pattern: String concatenation
        if ('concatenate' in desc_lower or 'join' in desc_lower or 'combine' in desc_lower) and 'string' in desc_lower:
            code_parts = []
            code_parts.append("str1 = input('Enter first string: ')")
            code_parts.append("str2 = input('Enter second string: ')")
            code_parts.append("result = str1 + str2")
            code_parts.append("print(result)")
            logger.info("Added string concatenation pattern")
            return '\\n'.join(code_parts)

        # Pattern: String length
        if ('length' in desc_lower or 'size' in desc_lower or 'count' in desc_lower) and 'string' in desc_lower:
            code_parts = []
            code_parts.append("text = input('Enter a string: ')")
            code_parts.append("length = len(text)")
            code_parts.append("print(length)")
            logger.info("Added string length pattern")
            return '\\n'.join(code_parts)

        # ========== LIST/ARRAY PATTERNS ==========

        # Pattern: Create a list
        if ('create' in desc_lower or 'make' in desc_lower or 'initialize' in desc_lower) and ('list' in desc_lower or 'array' in desc_lower):
            code_parts = []
            # Check for specific values
            values_match = re.search(r'(?:with|of|containing)\\s+([\\d,\\s]+)', description)
            if values_match:
                values = values_match.group(1).strip()
                code_parts.append(f"my_list = [{values}]")
            else:
                code_parts.append("my_list = [1, 2, 3, 4, 5]  # Example list")
            code_parts.append("print(my_list)")
            logger.info("Added list creation pattern")
            return '\\n'.join(code_parts)

        # Pattern: Append to list
        if ('append' in desc_lower or 'add' in desc_lower) and ('list' in desc_lower or 'array' in desc_lower):
            code_parts = []
            code_parts.append("my_list = [1, 2, 3]")
            code_parts.append("my_list.append(4)")
            code_parts.append("print(my_list)")
            logger.info("Added list append pattern")
            return '\\n'.join(code_parts)

        # Pattern: Sum of list elements
        if 'sum' in desc_lower and ('list' in desc_lower or 'array' in desc_lower or 'elements' in desc_lower):
            code_parts = []
            code_parts.append("my_list = [1, 2, 3, 4, 5]")
            code_parts.append("total = sum(my_list)")
            code_parts.append("print(total)")
            logger.info("Added list sum pattern")
            return '\\n'.join(code_parts)

        # Pattern: Find maximum/minimum in list
        if ('maximum' in desc_lower or 'max' in desc_lower or 'largest' in desc_lower) and ('list' in desc_lower or 'array' in desc_lower):
            code_parts = []
            code_parts.append("my_list = [1, 2, 3, 4, 5]")
            code_parts.append("maximum = max(my_list)")
            code_parts.append("print(maximum)")
            logger.info("Added list maximum pattern")
            return '\\n'.join(code_parts)
        
        if ('minimum' in desc_lower or 'min' in desc_lower or 'smallest' in desc_lower) and ('list' in desc_lower or 'array' in desc_lower):
            code_parts = []
            code_parts.append("my_list = [1, 2, 3, 4, 5]")
            code_parts.append("minimum = min(my_list)")
            code_parts.append("print(minimum)")
            logger.info("Added list minimum pattern")
            return '\\n'.join(code_parts)

        # Pattern: Sort a list
        if 'sort' in desc_lower and ('list' in desc_lower or 'array' in desc_lower):
            code_parts = []
            code_parts.append("my_list = [5, 2, 8, 1, 9]")
            if 'descending' in desc_lower or 'reverse' in desc_lower:
                code_parts.append("my_list.sort(reverse=True)")
            else:
                code_parts.append("my_list.sort()")
            code_parts.append("print(my_list)")
            logger.info("Added list sort pattern")
            return '\\n'.join(code_parts)

        # Pattern: Iterate through list
        if ('iterate' in desc_lower or 'loop' in desc_lower or 'traverse' in desc_lower) and ('list' in desc_lower or 'array' in desc_lower):
            code_parts = []
            code_parts.append("my_list = [1, 2, 3, 4, 5]")
            code_parts.append("for item in my_list:")
            code_parts.append("    print(item)")
            logger.info("Added list iteration pattern")
            return '\\n'.join(code_parts)

        return generated_code

    def _extract_range(self, description: str, assignments: list):
        """Extract start and end expressions for a numeric range from description.
        Returns (start_expr, end_expr) where each is either a number string or a variable name preserving case.
        """
        text = description
        # Match patterns: 'from X to Y', 'X to Y', 'between X and Y'
        patterns = [
            r'from\s+(\d+|[a-zA-Z_]\w*)\s+to\s+(\d+|[a-zA-Z_]\w*)',
            r'(\d+|[a-zA-Z_]\w*)\s+to\s+(\d+|[a-zA-Z_]\w*)',
            r'between\s+(\d+|[a-zA-Z_]\w*)\s+and\s+(\d+|[a-zA-Z_]\w*)'
        ]
        match = None
        for p in patterns:
            m = re.search(p, text, re.IGNORECASE)
            if m:
                match = m
                break
        if not match:
            # Fallback: look for explicit end like 'to 10' when start is implied as 1
            end_only = re.search(r'to\s+(\d+|[a-zA-Z_]\w*)', text, re.IGNORECASE)
            if end_only:
                start_expr = '1'
                end_expr = self._resolve_var_case(assignments, end_only.group(1))
                return start_expr, end_expr
            return None, None
        start_raw, end_raw = match.group(1), match.group(2)
        start_expr = self._resolve_var_case(assignments, start_raw)
        end_expr = self._resolve_var_case(assignments, end_raw)
        return start_expr, end_expr

    def _resolve_var_case(self, assignments: list, token: str) -> str:
        """Return token with correct case if it refers to a variable present in assignments; otherwise return as-is."""
        if token.isdigit():
            return token
        token_lower = token.lower()
        for a in assignments:
            var = a.split('=')[0].strip()
            if var.lower() == token_lower:
                return var
        return token
