import os
import logging
from groq import Groq

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        if not self.api_key:
            logger.warning("GROQ_API_KEY not found in environment variables")
        
        self.client = None
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")

    def process_kannada_input(self, kannada_text):
        """
        Takes Kannada text, translates it to English, and generates Python code.
        Returns a dictionary with english_description and generated_code.
        """
        if not self.client:
            return {
                "error": "Groq client not initialized. Please check API key."
            }

        try:
            # We can do this in one prompt for efficiency, or two for clarity.
            # Let's try a combined prompt to save latency.
            
            system_prompt = """You are an expert programming assistant proficient in Kannada, English, and Python.
            Your task is to:
            1. Translate a given Kannada instruction or description of a coding problem into clear English.
            2. Generate valid, executable Python code based on that instruction.

            Examples of expected output:
            
            Input: "ಹಲೋ ವರ್ಲ್ಡ್ ಎಂದು ಮುದ್ರಿಸು"
            Output: {"english_description": "print hello world", "python_code": "print(\\"Hello World\\")"}

            Input: "೧ ರಿಂದ ೧೦ ರವರೆಗೆ ಸಂಖ್ಯೆಗಳನ್ನು ಮುದ್ರಿಸು"
            Output: {"english_description": "print numbers from 1 to 10", "python_code": "for i in range(1, 11):\\n    print(i)"}

            Input: "ಸಂಖ್ಯೆ ಧನಾತ್ಮಕವಾಗಿದ್ದರೆ ಧನಾತ್ಮಕ ಎಂದು ಮುದ್ರಿಸು"
            Output: {"english_description": "if number is positive print positive", "python_code": "number = 5\\nif number > 0:\\n    print(\\"Positive\\")"}

            Input: "ಎರಡು ಸಂಖ್ಯೆಗಳನ್ನು ಸೇರಿಸುವ ಕಾರ್ಯವನ್ನು ರಚಿಸು"
            Output: {"english_description": "create a function to add two numbers", "python_code": "def add(a, b):\\n    return a + b"}

            Input: "೧ ರಿಂದ ೫ ರವರೆಗಿನ ಪಟ್ಟಿಯನ್ನು ರಚಿಸು"
            Output: {"english_description": "create a list from 1 to 5", "python_code": "numbers = [1, 2, 3, 4, 5]"}

            Input: "ಪಟ್ಟಿಯಲ್ಲಿರುವ ಎಲ್ಲಾ ಸಂಖ್ಯೆಗಳನ್ನು ಮುದ್ರಿಸು"
            Output: {"english_description": "print all numbers in the list", "python_code": "numbers = [1, 2, 3, 4, 5]\\nfor num in numbers:\\n    print(num)"}

            Input: "ಸಂಖ್ಯೆ ಸಮವಾಗಿದ್ದರೆ ಸಮ ಇಲ್ಲದಿದ್ದರೆ ಬೆಸ ಎಂದು ಮುದ್ರಿಸು"
            Output: {"english_description": "if number is even print even else print odd", "python_code": "number = 4\\nif number % 2 == 0:\\n    print(\\"Even\\")\\nelse:\\n    print(\\"Odd\\")"}

            Input: "೧ ರಿಂದ ೧೦೦ ರವರೆಗಿನ ಸಂಖ್ಯೆಗಳ ಮೊತ್ತವನ್ನು ಲೆಕ್ಕಹಾಕು"
            Output: {"english_description": "calculate sum of numbers from 1 to 100", "python_code": "total = sum(range(1, 101))\\nprint(total)"}

            Input: "ಪಟ್ಟಿಯಲ್ಲಿ ದೊಡ್ಡ ಸಂಖ್ಯೆಯನ್ನು ಹುಡುಕು"
            Output: {"english_description": "find the largest number in the list", "python_code": "numbers = [3, 7, 2, 9, 1]\\nlargest = max(numbers)\\nprint(largest)"}

            Input: "ವಾಕ್ಯವನ್ನು ಹಿಮ್ಮುಖವಾಗಿ ಮುದ್ರಿಸು"
            Output: {"english_description": "print the string in reverse", "python_code": "text = \\"Hello\\"\\nreversed_text = text[::-1]\\nprint(reversed_text)"}
            
            Return ONLY a valid JSON object with the following format (no markdown, no extra text):
            {
                "english_description": "The translated English description",
                "python_code": "The generated python code"
            }
            """
            
            user_prompt = f"Kannada Input: {kannada_text}"

            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile", # Using a strong model for translation and code
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                max_tokens=1024,
                response_format={"type": "json_object"}
            )

            result_json = completion.choices[0].message.content
            
            import json
            parsed_result = json.loads(result_json)
            
            return {
                "english_description": parsed_result.get("english_description", ""),
                "generated_code": parsed_result.get("python_code", "")
            }

        except Exception as e:
            logger.error(f"Groq API error: {e}")
            return {
                "error": str(e)
            }

# Singleton instance
groq_service = GroqService()
