import json
import asyncio
import sys
from channels.generic.websocket import AsyncWebsocketConsumer


class CodeExecutionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.process = None

    async def disconnect(self, close_code):
        if self.process:
            try:
                self.process.terminate()
            except:
                pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'execute':
            code = data.get('code', '')
            await self.execute_code(code)
        elif message_type == 'input':
            user_input = data.get('input', '')
            if self.process and self.process.stdin:
                try:
                    self.process.stdin.write((user_input + '\n').encode())
                    await self.process.stdin.drain()
                except Exception as e:
                    await self.send(text_data=json.dumps({
                        'type': 'error',
                        'message': f'Input error: {str(e)}'
                    }))

    async def execute_code(self, code):
        try:
            # Start Python process
            self.process = await asyncio.create_subprocess_exec(
                sys.executable, '-u', '-c', code,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            # Read output in real-time
            async def read_stream(stream, stream_type):
                while True:
                    line = await stream.readline()
                    if not line:
                        break
                    text = line.decode('utf-8', errors='ignore')
                    await self.send(text_data=json.dumps({
                        'type': 'output',
                        'stream': stream_type,
                        'data': text
                    }))

            # Create tasks for stdout and stderr
            stdout_task = asyncio.create_task(read_stream(self.process.stdout, 'stdout'))
            stderr_task = asyncio.create_task(read_stream(self.process.stderr, 'stderr'))

            # Wait for process to complete
            await asyncio.gather(stdout_task, stderr_task)
            await self.process.wait()

            # Send completion message
            await self.send(text_data=json.dumps({
                'type': 'complete',
                'exit_code': self.process.returncode
            }))

        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
