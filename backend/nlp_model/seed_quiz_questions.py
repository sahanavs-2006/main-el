"""
Script to seed 5 quiz questions for each topic into MongoDB using QuizRepository.
"""
from nlp_model.mongo_repositories import QuizRepository

# Define topics and 5 sample questions for each (Kannada/English)
topics = [
    {"category": "ಮುದ್ರಿಸಿ ಹೇಳಿಕೆ", "category_en": "Print Statement"},
    {"category": "ಡೇಟಾಟೈಪ್ಸ್", "category_en": "Datatypes"},
    {"category": "ವೇರಿಯಬಲ್", "category_en": "Variable"},
    {"category": "ನಿರ್ವಹಕಗಳು", "category_en": "Operators"},
    {"category": "ಪರತ್ಮಬದ್ಧ ಹೇಳಿಕೆಗಳು", "category_en": "Conditional Statements"},
    {"category": "ಲೂಪ್ ಹೇಳಿಕೆಗಳು", "category_en": "Loop Statements"},
]

# Example questions for each topic (replace with real content as needed)
example_questions = {
    "ಮುದ್ರಿಸಿ ಹೇಳಿಕೆ": [
        {
            "question_text": "Python ನಲ್ಲಿ output ಅನ್ನು ಪ್ರದರ್ಶಿಸಲು ಯಾವ function ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "print()", "is_correct": True},
                {"text": "output()", "is_correct": False},
                {"text": "display()", "is_correct": False},
                {"text": "show()", "is_correct": False},
            ],
            "explanation": "Python ನಲ್ಲಿ output ಪ್ರದರ್ಶಿಸಲು print() function ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ print() function ನಲ್ಲಿ comma (,) ಬಳಸಿದರೆ ಏನು ಆಗುತ್ತದೆ?",
            "options": [
                {"text": "Values are separated by space", "is_correct": True},
                {"text": "Values are concatenated", "is_correct": False},
                {"text": "Error occurs", "is_correct": False},
                {"text": "No output", "is_correct": False},
            ],
            "explanation": "Comma separates values with a space in print()."
        },
        {
            "question_text": "print('A', end='') print('B') gives what output?",
            "options": [
                {"text": "AB", "is_correct": True},
                {"text": "A B", "is_correct": False},
                {"text": "A\nB", "is_correct": False},
                {"text": "Error", "is_correct": False},
            ],
            "explanation": "end='' prevents newline, so output is AB."
        },
        {
            "question_text": "Which escape character is used for tab space in print()?",
            "options": [
                {"text": "\t", "is_correct": True},
                {"text": "\n", "is_correct": False},
                {"text": "\\", "is_correct": False},
                {"text": "\r", "is_correct": False},
            ],
            "explanation": "\t is used for tab space."
        },
        {
            "question_text": "What is the output of print('Hello', 'World')?",
            "options": [
                {"text": "Hello World", "is_correct": True},
                {"text": "HelloWorld", "is_correct": False},
                {"text": "Hello,World", "is_correct": False},
                {"text": "Error", "is_correct": False},
            ],
            "explanation": "Multiple arguments are separated by space."
        },
        {
            "question_text": "Python ನಲ್ಲಿ print() function ನಲ್ಲಿ end parameter ನ default value ಯಾವುದು?",
            "options": [
                {"text": "\n", "is_correct": True},
                {"text": "space", "is_correct": False},
                {"text": ",", "is_correct": False},
                {"text": "tab", "is_correct": False},
            ],
            "explanation": "end parameter ನ default value '\n' (newline) ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ print() function multiline output ನೀಡಲು ಯಾವ character ಬಳಸಬೇಕು?",
            "options": [
                {"text": "\n", "is_correct": True},
                {"text": "\\", "is_correct": False},
                {"text": "\t", "is_correct": False},
                {"text": "\r", "is_correct": False},
            ],
            "explanation": "\n character multiline output ನೀಡಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ print() function ನಲ್ಲಿ separator (sep) parameter ನ default value ಯಾವುದು?",
            "options": [
                {"text": "space", "is_correct": True},
                {"text": ",", "is_correct": False},
                {"text": "-", "is_correct": False},
                {"text": ";", "is_correct": False},
            ],
            "explanation": "sep parameter ನ default value space ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ print() function ನಲ್ಲಿ end parameter ಅನ್ನು '\\t' ಎಂದು ನೀಡಿದರೆ, output ಹೇಗಿರುತ್ತದೆ?",
            "options": [
                {"text": "tab space at end", "is_correct": True},
                {"text": "newline at end", "is_correct": False},
                {"text": "comma at end", "is_correct": False},
                {"text": "no space", "is_correct": False},
            ],
            "explanation": "end='\\t' ಎಂದರೆ output ನಂತರ tab space ಬರುತ್ತದೆ."
        },
        {
            "question_text": "print() function ನಲ್ಲಿ string ಅನ್ನು ಹೇಗೆ ಪ್ರದರ್ಶಿಸಬಹುದು?",
            "options": [
                {"text": "print('Hello')", "is_correct": True},
                {"text": "print(Hello)", "is_correct": False},
                {"text": "echo('Hello')", "is_correct": False},
                {"text": "display('Hello')", "is_correct": False},
            ],
            "explanation": "String ಅನ್ನು print('Hello') ಎಂದು ಪ್ರದರ್ಶಿಸಬಹುದು."
        },
        {
            "question_text": "Python ನಲ್ಲಿ ಒಂದು ಸಾಲಿನಲ್ಲಿ ಎರಡು values ಅನ್ನು ಹೇಗೆ print ಮಾಡಬಹುದು?",
            "options": [
                {"text": "print(1, 2)", "is_correct": True},
                {"text": "print(1 + 2)", "is_correct": False},
                {"text": "print(1;2)", "is_correct": False},
                {"text": "print(1:2)", "is_correct": False},
            ],
            "explanation": "print(1, 2) ಎರಡು values ಅನ್ನು ಒಂದೇ ಸಾಲಿನಲ್ಲಿ ಪ್ರದರ್ಶಿಸುತ್ತದೆ."
        },
        {
            "question_text": "print() function ನಲ್ಲಿ end parameter ನ default value ಯಾವುದು?",
            "options": [
                {"text": "\n", "is_correct": True},
                {"text": "space", "is_correct": False},
                {"text": ",", "is_correct": False},
                {"text": "tab", "is_correct": False},
            ],
            "explanation": "end parameter ನ default value '\n' (newline) ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ print() function multiline output ನೀಡಲು ಯಾವ character ಬಳಸಬೇಕು?",
            "options": [
                {"text": "\n", "is_correct": True},
                {"text": "\\", "is_correct": False},
                {"text": "\t", "is_correct": False},
                {"text": "\r", "is_correct": False},
            ],
            "explanation": "\n character multiline output ನೀಡಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
    ],
    "ಡೇಟಾಟೈಪ್ಸ್": [
        {
            "question_text": "Python ನಲ್ಲಿ ಯಾವ data type ಸಂಖ್ಯೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "int", "is_correct": True},
                {"text": "str", "is_correct": False},
                {"text": "list", "is_correct": False},
                {"text": "dict", "is_correct": False},
            ],
            "explanation": "int data type ಸಂಖ್ಯೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Which data type is used for text in Python?",
            "options": [
                {"text": "str", "is_correct": True},
                {"text": "int", "is_correct": False},
                {"text": "float", "is_correct": False},
                {"text": "bool", "is_correct": False},
            ],
            "explanation": "str is used for text."
        },
        {
            "question_text": "What is the type of True in Python?",
            "options": [
                {"text": "bool", "is_correct": True},
                {"text": "int", "is_correct": False},
                {"text": "str", "is_correct": False},
                {"text": "float", "is_correct": False},
            ],
            "explanation": "True is of type bool."
        },
        {
            "question_text": "Which of these is a list?",
            "options": [
                {"text": "[1, 2, 3]", "is_correct": True},
                {"text": "(1, 2, 3)", "is_correct": False},
                {"text": "{'a': 1}", "is_correct": False},
                {"text": "'123'", "is_correct": False},
            ],
            "explanation": "[1, 2, 3] is a list."
        },
        {
            "question_text": "Which of these is a dictionary?",
            "options": [
                {"text": "{'a': 1}", "is_correct": True},
                {"text": "[1, 2, 3]", "is_correct": False},
                {"text": "(1, 2, 3)", "is_correct": False},
                {"text": "'a:1'", "is_correct": False},
            ],
            "explanation": "{'a': 1} is a dictionary."
        },
        {
            "question_text": "Python ನಲ್ಲಿ string data type ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "'hello'", "is_correct": True},
                {"text": "hello", "is_correct": False},
                {"text": "str hello", "is_correct": False},
                {"text": "string('hello')", "is_correct": False},
            ],
            "explanation": "'hello' ಅಥವಾ \"hello\" string data type ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ list data type ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "[1, 2, 3]", "is_correct": True},
                {"text": "{1, 2, 3}", "is_correct": False},
                {"text": "(1, 2, 3)", "is_correct": False},
                {"text": "list(1,2,3)", "is_correct": False},
            ],
            "explanation": "[1, 2, 3] list data type ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ dictionary data type ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "{'a': 1}", "is_correct": True},
                {"text": "[1, 2]", "is_correct": False},
                {"text": "(1, 2)", "is_correct": False},
                {"text": "{1, 2, 3}", "is_correct": False},
            ],
            "explanation": "{'a': 1} dictionary data type ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ float data type ಯಾವುದು?",
            "options": [
                {"text": "3.14", "is_correct": True},
                {"text": "3", "is_correct": False},
                {"text": "'3.14'", "is_correct": False},
                {"text": "[3.14]", "is_correct": False},
            ],
            "explanation": "3.14 float data type ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ string data type ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "'hello'", "is_correct": True},
                {"text": "hello", "is_correct": False},
                {"text": "str hello", "is_correct": False},
                {"text": "string('hello')", "is_correct": False},
            ],
            "explanation": "'hello' ಅಥವಾ \"hello\" string data type ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ list data type ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "[1, 2, 3]", "is_correct": True},
                {"text": "{1, 2, 3}", "is_correct": False},
                {"text": "(1, 2, 3)", "is_correct": False},
                {"text": "list(1,2,3)", "is_correct": False},
            ],
            "explanation": "[1, 2, 3] list data type ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ dictionary data type ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "{'a': 1}", "is_correct": True},
                {"text": "[1, 2]", "is_correct": False},
                {"text": "(1, 2)", "is_correct": False},
                {"text": "{1, 2, 3}", "is_correct": False},
            ],
            "explanation": "{'a': 1} dictionary data type ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ float data type ಯಾವುದು?",
            "options": [
                {"text": "3.14", "is_correct": True},
                {"text": "3", "is_correct": False},
                {"text": "'3.14'", "is_correct": False},
                {"text": "[3.14]", "is_correct": False},
            ],
            "explanation": "3.14 float data type ಆಗಿದೆ."
        },
    ],
    "ವೇರಿಯಬಲ್": [
        {
            "question_text": "Python ನಲ್ಲಿ variable ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "x = 5", "is_correct": True},
                {"text": "int x = 5", "is_correct": False},
                {"text": "var x = 5", "is_correct": False},
                {"text": "let x = 5", "is_correct": False},
            ],
            "explanation": "Python ನಲ್ಲಿ variable ಅನ್ನು x = 5 ಎಂದು ಘೋಷಿಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Which of these is a valid variable name?",
            "options": [
                {"text": "my_var", "is_correct": True},
                {"text": "2var", "is_correct": False},
                {"text": "var-name", "is_correct": False},
                {"text": "my var", "is_correct": False},
            ],
            "explanation": "my_var is a valid variable name."
        },
        {
            "question_text": "Are variable names case-sensitive in Python?",
            "options": [
                {"text": "Yes", "is_correct": True},
                {"text": "No", "is_correct": False},
                {"text": "Sometimes", "is_correct": False},
                {"text": "Never", "is_correct": False},
            ],
            "explanation": "Variable names are case-sensitive."
        },
        {
            "question_text": "Can you change the value of a variable after assignment?",
            "options": [
                {"text": "Yes", "is_correct": True},
                {"text": "No", "is_correct": False},
                {"text": "Only once", "is_correct": False},
                {"text": "Never", "is_correct": False},
            ],
            "explanation": "Variables are mutable."
        },
        {
            "question_text": "Which symbol is used for assignment in Python?",
            "options": [
                {"text": "=", "is_correct": True},
                {"text": ":", "is_correct": False},
                {"text": "+", "is_correct": False},
                {"text": "==", "is_correct": False},
            ],
            "explanation": "= is used for assignment."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable name ಯಾವುದು ಮಾನ್ಯ?",
            "options": [
                {"text": "my_var", "is_correct": True},
                {"text": "2var", "is_correct": False},
                {"text": "var-name", "is_correct": False},
                {"text": "my var", "is_correct": False},
            ],
            "explanation": "my_var ಮಾನ್ಯ variable name ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable name case-sensitive ಆಗಿದೆಯೇ?",
            "options": [
                {"text": "ಹೌದು", "is_correct": True},
                {"text": "ಇಲ್ಲ", "is_correct": False},
                {"text": "ಕೆಲವೊಮ್ಮೆ", "is_correct": False},
                {"text": "ಪರಿಗಣನೆ ಇಲ್ಲ", "is_correct": False},
            ],
            "explanation": "Python ನಲ್ಲಿ variable names case-sensitive ಆಗಿವೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable assign ಮಾಡಿದ ಮೇಲೆ value ಬದಲಾಯಿಸಬಹುದೇ?",
            "options": [
                {"text": "ಹೌದು", "is_correct": True},
                {"text": "ಇಲ್ಲ", "is_correct": False},
                {"text": "ಒಮ್ಮೆ ಮಾತ್ರ", "is_correct": False},
                {"text": "ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ", "is_correct": False},
            ],
            "explanation": "Python variables mutable ಆಗಿವೆ, value ಬದಲಾಯಿಸಬಹುದು."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable assign ಮಾಡಲು ಯಾವ symbol ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "=", "is_correct": True},
                {"text": ":", "is_correct": False},
                {"text": "+", "is_correct": False},
                {"text": "==", "is_correct": False},
            ],
            "explanation": "= symbol variable assign ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable name ಯಾವುದು ಮಾನ್ಯ?",
            "options": [
                {"text": "my_var", "is_correct": True},
                {"text": "2var", "is_correct": False},
                {"text": "var-name", "is_correct": False},
                {"text": "my var", "is_correct": False},
            ],
            "explanation": "my_var ಮಾನ್ಯ variable name ಆಗಿದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable name case-sensitive ಆಗಿದೆಯೇ?",
            "options": [
                {"text": "ಹೌದು", "is_correct": True},
                {"text": "ಇಲ್ಲ", "is_correct": False},
                {"text": "ಕೆಲವೊಮ್ಮೆ", "is_correct": False},
                {"text": "ಪರಿಗಣನೆ ಇಲ್ಲ", "is_correct": False},
            ],
            "explanation": "Python ನಲ್ಲಿ variable names case-sensitive ಆಗಿವೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable assign ಮಾಡಿದ ಮೇಲೆ value ಬದಲಾಯಿಸಬಹುದೇ?",
            "options": [
                {"text": "ಹೌದು", "is_correct": True},
                {"text": "ಇಲ್ಲ", "is_correct": False},
                {"text": "ಒಮ್ಮೆ ಮಾತ್ರ", "is_correct": False},
                {"text": "ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ", "is_correct": False},
            ],
            "explanation": "Python variables mutable ಆಗಿವೆ, value ಬದಲಾಯಿಸಬಹುದು."
        },
        {
            "question_text": "Python ನಲ್ಲಿ variable assign ಮಾಡಲು ಯಾವ symbol ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "=", "is_correct": True},
                {"text": ":", "is_correct": False},
                {"text": "+", "is_correct": False},
                {"text": "==", "is_correct": False},
            ],
            "explanation": "= symbol variable assign ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
    ],
    "ನಿರ್ವಹಕಗಳು": [
        {
            "question_text": "Python ನಲ್ಲಿ + operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Addition", "is_correct": True},
                {"text": "Subtraction", "is_correct": False},
                {"text": "Multiplication", "is_correct": False},
                {"text": "Division", "is_correct": False},
            ],
            "explanation": "+ operator ಅನ್ನು ಸೇರಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "What does the // operator do in Python?",
            "options": [
                {"text": "Floor division", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Modulo", "is_correct": False},
                {"text": "Exponentiation", "is_correct": False},
            ],
            "explanation": "// is floor division."
        },
        {
            "question_text": "What does the % operator do in Python?",
            "options": [
                {"text": "Modulo", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Multiplication", "is_correct": False},
                {"text": "Division", "is_correct": False},
            ],
            "explanation": "% is modulo."
        },
        {
            "question_text": "What does the * operator do in Python?",
            "options": [
                {"text": "Multiplication", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Division", "is_correct": False},
                {"text": "Subtraction", "is_correct": False},
            ],
            "explanation": "* is multiplication."
        },
        {
            "question_text": "What does the - operator do in Python?",
            "options": [
                {"text": "Subtraction", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Multiplication", "is_correct": False},
                {"text": "Division", "is_correct": False},
            ],
            "explanation": "- is subtraction."
        },
        {
            "question_text": "Python ನಲ್ಲಿ // operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Floor division", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Modulo", "is_correct": False},
                {"text": "Exponentiation", "is_correct": False},
            ],
            "explanation": "// operator floor division ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ % operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Modulo", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Multiplication", "is_correct": False},
                {"text": "Division", "is_correct": False},
            ],
            "explanation": "% operator modulo ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ * operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Multiplication", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Division", "is_correct": False},
                {"text": "Subtraction", "is_correct": False},
            ],
            "explanation": "* operator multiplication ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ - operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Subtraction", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Multiplication", "is_correct": False},
                {"text": "Division", "is_correct": False},
            ],
            "explanation": "- operator subtraction ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ // operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Floor division", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Modulo", "is_correct": False},
                {"text": "Exponentiation", "is_correct": False},
            ],
            "explanation": "// operator floor division ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ % operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Modulo", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Multiplication", "is_correct": False},
                {"text": "Division", "is_correct": False},
            ],
            "explanation": "% operator modulo ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ * operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Multiplication", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Division", "is_correct": False},
                {"text": "Subtraction", "is_correct": False},
            ],
            "explanation": "* operator multiplication ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ - operator ಯಾವ ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ?",
            "options": [
                {"text": "Subtraction", "is_correct": True},
                {"text": "Addition", "is_correct": False},
                {"text": "Multiplication", "is_correct": False},
                {"text": "Division", "is_correct": False},
            ],
            "explanation": "- operator subtraction ಕಾರ್ಯವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ."
        },
    ],
    "ಪರತ್ಮಬದ್ಧ ಹೇಳಿಕೆಗಳು": [
        {
            "question_text": "Python ನಲ್ಲಿ if statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Condition ಪರಿಶೀಲಿಸಲು", "is_correct": True},
                {"text": "Loop ಮಾಡಲು", "is_correct": False},
                {"text": "Function ಘೋಷಿಸಲು", "is_correct": False},
                {"text": "Class ಸೃಷ್ಟಿಸಲು", "is_correct": False},
            ],
            "explanation": "if statement ಅನ್ನು ಶರತ್ತು ಪರಿಶೀಲಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "When is the else statement used in Python?",
            "options": [
                {"text": "If condition is false", "is_correct": True},
                {"text": "If condition is true", "is_correct": False},
                {"text": "In a loop", "is_correct": False},
                {"text": "In a function", "is_correct": False},
            ],
            "explanation": "else is used when if is false."
        },
        {
            "question_text": "What does elif mean in Python?",
            "options": [
                {"text": "Else if", "is_correct": True},
                {"text": "Else for", "is_correct": False},
                {"text": "Else loop", "is_correct": False},
                {"text": "Else function", "is_correct": False},
            ],
            "explanation": "elif means else if."
        },
        {
            "question_text": "What is a nested if statement?",
            "options": [
                {"text": "if inside another if", "is_correct": True},
                {"text": "if after else", "is_correct": False},
                {"text": "loop inside if", "is_correct": False},
                {"text": "function inside if", "is_correct": False},
            ],
            "explanation": "if inside another if is nested if."
        },
        {
            "question_text": "Which block executes if the condition is true?",
            "options": [
                {"text": "if block", "is_correct": True},
                {"text": "else block", "is_correct": False},
                {"text": "for block", "is_correct": False},
                {"text": "while block", "is_correct": False},
            ],
            "explanation": "if block executes if condition is true."
        },
        {
            "question_text": "Python ನಲ್ಲಿ else statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "if statement false ಆಗಿದ್ದರೆ", "is_correct": True},
                {"text": "if statement true ಆಗಿದ್ದರೆ", "is_correct": False},
                {"text": "loop ನಲ್ಲಿ", "is_correct": False},
                {"text": "function ನಲ್ಲಿ", "is_correct": False},
            ],
            "explanation": "else statement ಅನ್ನು if statement false ಆಗಿದ್ದರೆ ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ elif statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Multiple conditions", "is_correct": True},
                {"text": "Single condition", "is_correct": False},
                {"text": "No condition", "is_correct": False},
                {"text": "Loop", "is_correct": False},
            ],
            "explanation": "elif statement multiple conditions ಪರಿಶೀಲಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ nested if statements ಎಂದರೆ ಏನು?",
            "options": [
                {"text": "if statement inside another if", "is_correct": True},
                {"text": "if statement after else", "is_correct": False},
                {"text": "loop inside if", "is_correct": False},
                {"text": "function inside if", "is_correct": False},
            ],
            "explanation": "nested if ಎಂದರೆ if statement ಮತ್ತೊಂದು if statement ಒಳಗೆ ಇರುವದು."
        },
        {
            "question_text": "Python ನಲ್ಲಿ condition true ಆಗಿದ್ದರೆ ಯಾವ block execute ಆಗುತ್ತದೆ?",
            "options": [
                {"text": "if block", "is_correct": True},
                {"text": "else block", "is_correct": False},
                {"text": "for block", "is_correct": False},
                {"text": "while block", "is_correct": False},
            ],
            "explanation": "condition true ಆಗಿದ್ದರೆ if block execute ಆಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ else statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "if statement false ಆಗಿದ್ದರೆ", "is_correct": True},
                {"text": "if statement true ಆಗಿದ್ದರೆ", "is_correct": False},
                {"text": "loop ನಲ್ಲಿ", "is_correct": False},
                {"text": "function ನಲ್ಲಿ", "is_correct": False},
            ],
            "explanation": "else statement ಅನ್ನು if statement false ಆಗಿದ್ದರೆ ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ elif statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Multiple conditions", "is_correct": True},
                {"text": "Single condition", "is_correct": False},
                {"text": "No condition", "is_correct": False},
                {"text": "Loop", "is_correct": False},
            ],
            "explanation": "elif statement multiple conditions ಪರಿಶೀಲಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ nested if statements ಎಂದರೆ ಏನು?",
            "options": [
                {"text": "if statement inside another if", "is_correct": True},
                {"text": "if statement after else", "is_correct": False},
                {"text": "loop inside if", "is_correct": False},
                {"text": "function inside if", "is_correct": False},
            ],
            "explanation": "nested if ಎಂದರೆ if statement ಮತ್ತೊಂದು if statement ಒಳಗೆ ಇರುವದು."
        },
        {
            "question_text": "Python ನಲ್ಲಿ condition true ಆಗಿದ್ದರೆ ಯಾವ block execute ಆಗುತ್ತದೆ?",
            "options": [
                {"text": "if block", "is_correct": True},
                {"text": "else block", "is_correct": False},
                {"text": "for block", "is_correct": False},
                {"text": "while block", "is_correct": False},
            ],
            "explanation": "condition true ಆಗಿದ್ದರೆ if block execute ಆಗುತ್ತದೆ."
        },
    ],
    "ಲೂಪ್ ಹೇಳಿಕೆಗಳು": [
        {
            "question_text": "Python ನಲ್ಲಿ for loop ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Repeated execution", "is_correct": True},
                {"text": "Single execution", "is_correct": False},
                {"text": "Error handling", "is_correct": False},
                {"text": "Input reading", "is_correct": False},
            ],
            "explanation": "for loop ಅನ್ನು ಪುನರಾವೃತ ಕಾರ್ಯಗಳಿಗೆ ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "When is while loop used in Python?",
            "options": [
                {"text": "When condition is true", "is_correct": True},
                {"text": "Single execution", "is_correct": False},
                {"text": "Error handling", "is_correct": False},
                {"text": "Input reading", "is_correct": False},
            ],
            "explanation": "while loop runs while condition is true."
        },
        {
            "question_text": "What does break statement do in a loop?",
            "options": [
                {"text": "Exits the loop", "is_correct": True},
                {"text": "Continues to next iteration", "is_correct": False},
                {"text": "Skips loop", "is_correct": False},
                {"text": "Restarts loop", "is_correct": False},
            ],
            "explanation": "break exits the loop."
        },
        {
            "question_text": "What does continue statement do in a loop?",
            "options": [
                {"text": "Skips current iteration", "is_correct": True},
                {"text": "Ends the loop", "is_correct": False},
                {"text": "Starts new loop", "is_correct": False},
                {"text": "Breaks loop", "is_correct": False},
            ],
            "explanation": "continue skips current iteration."
        },
        {
            "question_text": "What does range() function do in a for loop?",
            "options": [
                {"text": "Creates a sequence", "is_correct": True},
                {"text": "Splits a string", "is_correct": False},
                {"text": "Gets dictionary keys", "is_correct": False},
                {"text": "Appends to list", "is_correct": False},
            ],
            "explanation": "range() creates a sequence for for loop."
        },
        {
            "question_text": "Python ನಲ್ಲಿ while loop ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Condition true ಆಗಿರುವವರೆಗೆ", "is_correct": True},
                {"text": "Single execution", "is_correct": False},
                {"text": "Error handling", "is_correct": False},
                {"text": "Input reading", "is_correct": False},
            ],
            "explanation": "while loop condition true ಆಗಿರುವವರೆಗೆ execute ಆಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ break statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Loop ನಿಂದ ಹೊರಬರುವ", "is_correct": True},
                {"text": "Loop ಮುಂದುವರಿಸಲು", "is_correct": False},
                {"text": "Condition true ಆಗಲು", "is_correct": False},
                {"text": "Function call ಮಾಡಲು", "is_correct": False},
            ],
            "explanation": "break statement loop ನಿಂದ ಹೊರಬರುವುದಕ್ಕೆ ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ continue statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Skip current iteration", "is_correct": True},
                {"text": "End loop", "is_correct": False},
                {"text": "Start new loop", "is_correct": False},
                {"text": "Break loop", "is_correct": False},
            ],
            "explanation": "continue statement current iteration skip ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ range() function ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "for loop ನಲ್ಲಿ sequence ಸೃಷ್ಟಿಸಲು", "is_correct": True},
                {"text": "string split ಮಾಡಲು", "is_correct": False},
                {"text": "dictionary keys ಪಡೆಯಲು", "is_correct": False},
                {"text": "list append ಮಾಡಲು", "is_correct": False},
            ],
            "explanation": "range() function for loop ನಲ್ಲಿ sequence ಸೃಷ್ಟಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ while loop ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Condition true ಆಗಿರುವವರೆಗೆ", "is_correct": True},
                {"text": "Single execution", "is_correct": False},
                {"text": "Error handling", "is_correct": False},
                {"text": "Input reading", "is_correct": False},
            ],
            "explanation": "while loop condition true ಆಗಿರುವವರೆಗೆ execute ಆಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ break statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Loop ನಿಂದ ಹೊರಬರುವ", "is_correct": True},
                {"text": "Loop ಮುಂದುವರಿಸಲು", "is_correct": False},
                {"text": "Condition true ಆಗಲು", "is_correct": False},
                {"text": "Function call ಮಾಡಲು", "is_correct": False},
            ],
            "explanation": "break statement loop ನಿಂದ ಹೊರಬರುವುದಕ್ಕೆ ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ continue statement ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "Skip current iteration", "is_correct": True},
                {"text": "End loop", "is_correct": False},
                {"text": "Start new loop", "is_correct": False},
                {"text": "Break loop", "is_correct": False},
            ],
            "explanation": "continue statement current iteration skip ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
        {
            "question_text": "Python ನಲ್ಲಿ range() function ಯಾವಾಗ ಬಳಸಲಾಗುತ್ತದೆ?",
            "options": [
                {"text": "for loop ನಲ್ಲಿ sequence ಸೃಷ್ಟಿಸಲು", "is_correct": True},
                {"text": "string split ಮಾಡಲು", "is_correct": False},
                {"text": "dictionary keys ಪಡೆಯಲು", "is_correct": False},
                {"text": "list append ಮಾಡಲು", "is_correct": False},
            ],
            "explanation": "range() function for loop ನಲ್ಲಿ sequence ಸೃಷ್ಟಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ."
        },
    ],
}

def seed_quiz_questions():
    for topic in topics:
        category = topic["category"]
        questions = example_questions.get(category, [])
        for q in questions:
            QuizRepository.create_question(
                question_text=q["question_text"],
                category=category,
                difficulty="easy",
                options=q["options"],
                explanation=q["explanation"]
            )
    print("Quiz questions seeded.")

if __name__ == "__main__":
    seed_quiz_questions()
