
import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import QuizQuestion, QuizOption

additional_questions = {
    "basic_syntax": [
        {
            "question_text": "Python ನಲ್ಲಿ variable name ಹೇಗಿರಬಾರದು?",
            "options": [
                {"text": "ಸಂಖ್ಯೆಯಿಂದ ಪ್ರಾರಂಭವಾಗಬಾರದು", "is_correct": True},
                {"text": " underscore (_) ನಿಂದ ಪ್ರಾರಂಭವಾಗಬಾರದು", "is_correct": False},
                {"text": "ದೊಡ್ಡ ಅಕ್ಷರಗಳಿಂದ (Uppercase) ಪ್ರಾರಂಭವಾಗಬಾರದು", "is_correct": False},
                {"text": "ಯಾವುದೂ ಅಲ್ಲ", "is_correct": False},
            ],
            "explanation": "Variable names cannot start with a number."
        },
        {
            "question_text": "What is the output of 2 ** 3 in Python?",
            "options": [
                {"text": "8", "is_correct": True},
                {"text": "6", "is_correct": False},
                {"text": "5", "is_correct": False},
                {"text": "9", "is_correct": False},
            ],
            "explanation": "** is the exponentiation operator (2 power 3)."
        }
    ],
    "loops": [
        {
            "question_text": "What is an infinite loop?",
            "options": [
                {"text": "A loop that never ends", "is_correct": True},
                {"text": "A loop that runs once", "is_correct": False},
                {"text": "A loop inside a loop", "is_correct": False},
                {"text": "A fast loop", "is_correct": False},
            ],
            "explanation": "An infinite loop has a condition that always stays true."
        },
        {
            "question_text": "Python ನಲ್ಲಿ range(5) ಏನನ್ನು ನೀಡುತ್ತದೆ?",
            "options": [
                {"text": "0, 1, 2, 3, 4", "is_correct": True},
                {"text": "1, 2, 3, 4, 5", "is_correct": False},
                {"text": "0, 1, 2, 3, 4, 5", "is_correct": False},
                {"text": "5, 4, 3, 2, 1", "is_correct": False},
            ],
            "explanation": "range(n) generates numbers from 0 to n-1."
        }
    ],
    "conditionals": [
        {
            "question_text": "Python ನಲ್ಲಿ 'and' operator ಯಾವಾಗ True ನೀಡುತ್ತದೆ?",
            "options": [
                {"text": "ಎರಡೂ conditions True ಇದ್ದರೆ", "is_correct": True},
                {"text": "ಒಂದು condition True ಇದ್ದರೆ", "is_correct": False},
                {"text": "ಎರಡೂ conditions False ಇದ್ದರೆ", "is_correct": False},
                {"text": "ಯಾವುದೂ ಅಲ್ಲ", "is_correct": False},
            ],
            "explanation": "'and' requires both operands to be True."
        },
        {
            "question_text": "What is the value of (True or False) and False?",
            "options": [
                {"text": "False", "is_correct": True},
                {"text": "True", "is_correct": False},
                {"text": "Error", "is_correct": False},
                {"text": "None", "is_correct": False},
            ],
            "explanation": "(True or False) is True. True and False is False."
        }
    ],
    "functions": [
        {
            "question_text": "Python ನಲ್ಲಿ function define ಮಾಡಲು ಯಾವ keyword ಬಳಸುತ್ತಾರೆ?",
            "options": [
                {"text": "def", "is_correct": True},
                {"text": "func", "is_correct": False},
                {"text": "function", "is_correct": False},
                {"text": "define", "is_correct": False},
            ],
            "explanation": "def keyword is used to define a function."
        },
        {
            "question_text": "What does 'return' do in a function?",
            "options": [
                {"text": "Sends a value back and ends function", "is_correct": True},
                {"text": "Prints a value", "is_correct": False},
                {"text": "Repeats the function", "is_correct": False},
                {"text": "Pauses the function", "is_correct": False},
            ],
            "explanation": "return exits the function and passes a value back."
        }
    ],
    "data_structures": [
        {
            "question_text": "List ನಲ್ಲಿ ಕೊನೆಯ element ಪಡೆಯಲು index ಯಾವುದು?",
            "options": [
                {"text": "-1", "is_correct": True},
                {"text": "0", "is_correct": False},
                {"text": "last", "is_correct": False},
                {"text": "1", "is_correct": False},
            ],
            "explanation": "Negative indexing -1 refers to the last element."
        },
        {
            "question_text": "Which method adds an element to the end of a list?",
            "options": [
                {"text": "append()", "is_correct": True},
                {"text": "add()", "is_correct": False},
                {"text": "insert()", "is_correct": False},
                {"text": "push()", "is_correct": False},
            ],
            "explanation": "append() adds an item to the end of the list."
        }
    ],
    "algorithms": [
       {
            "question_text": "Algorithm ಎಂದರೇನು?",
            "options": [
                {"text": "ಸಮಸ್ಯೆ ಬಗೆಹರಿಸಲು ಹಂತ ಹಂತದ ವಿಧಾನ", "is_correct": True},
                {"text": "ಒಂದು ಕಂಪ್ಯೂಟರ್ ಪ್ರೋಗ್ರಾಂ", "is_correct": False},
                {"text": "ಒಂದು ಗಣಿತ ಸೂತ್ರ", "is_correct": False},
                {"text": "ಯಾವುದೂ ಅಲ್ಲ", "is_correct": False},
            ],
            "explanation": "Algorithm is a step-by-step procedure to solve a problem."
        }
    ]
}

def seed_extra_questions():
    print("Seeding extra leaderboard questions...")
    
    count = 0
    for category, questions in additional_questions.items():
        for q_data in questions:
            # Check if duplicate exists
            if QuizQuestion.objects.filter(question_kannada=q_data["question_text"]).exists():
                continue
                
            question = QuizQuestion.objects.create(
                category=category,
                question_kannada=q_data["question_text"],
                question_english=q_data["question_text"], # Assuming mixed language input
                difficulty='medium'
            )
            
            for i, opt_data in enumerate(q_data["options"]):
                QuizOption.objects.create(
                    question=question,
                    option_text_kannada=opt_data["text"],
                    option_text_english=opt_data["text"],
                    is_correct=opt_data["is_correct"],
                    explanation_kannada=q_data.get("explanation", ""),
                    order=i
                )
            count += 1
            
    print(f"Successfully added {count} new questions!")

if __name__ == "__main__":
    seed_extra_questions()
