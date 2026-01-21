
import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import QuizQuestion, QuizOption

full_questions = {
    "basic_syntax": [
        {
            "q": "Python ನಲ್ಲಿ comment ಬರೆಯಲು ಯಾವ ಚಿಹ್ನೆ (symbol) ಬಳಸುತ್ತಾರೆ?",
            "e": "Which symbol is used for comments in Python?",
            "options": [
                {"t": "#", "c": True},
                {"t": "//", "c": False},
                {"t": "/*", "c": False},
                {"t": "--", "c": False}
            ]
        },
        {
            "q": "Python ನಲ್ಲಿ block of code ಸೂಚಿಸಲು ಏನು ಬಳಸುತ್ತಾರೆ?",
            "e": "What is used to indicate a block of code in Python?",
            "options": [
                {"t": "Indentation (Space)", "c": True},
                {"t": "Curly braces {}", "c": False},
                {"t": "Semi-colon ;", "c": False},
                {"t": "Parentheses ()", "c": False}
            ]
        },
        {
            "q": "ಒಂದು variable ಗೆ value assign ಮಾಡಲು ಯಾವ ಚಿಹ್ನೆ ಬಳಸುತ್ತಾರೆ?",
            "e": "Which operator is used to assign a value to a variable?",
            "options": [
                {"t": "=", "c": True},
                {"t": "==", "c": False},
                {"t": ":", "c": False},
                {"t": "->", "c": False}
            ]
        },
        {
            "q": "Screen ಮೇಲೆ output ತೋರಿಸಲು ಯಾವ function ಬಳಸುತ್ತಾರೆ?",
            "e": "Which function is used to display output on the screen?",
            "options": [
                {"t": "print()", "c": True},
                {"t": "output()", "c": False},
                {"t": "show()", "c": False},
                {"t": "display()", "c": False}
            ]
        },
        {
            "q": "ಬಳಕೆದಾರರಿಂದ (user) input ಪಡೆಯಲು ಯಾವ function ಬಳಸುತ್ತಾರೆ?",
            "e": "Which function is used to get input from the user?",
            "options": [
                {"t": "input()", "c": True},
                {"t": "get()", "c": False},
                {"t": "read()", "c": False},
                {"t": "scan()", "c": False}
            ]
        }
    ],
    "conditionals": [
        {
            "q": "'if' statement ಯಾವಾಗ execute ಆಗುತ್ತದೆ?",
            "e": "When does the 'if' statement execute?",
            "options": [
                {"t": "Condition True ಇದ್ದರೆ", "c": True},
                {"t": "Condition False ಇದ್ದರೆ", "c": False},
                {"t": "ಯಾವಾಗಲೂ (Always)", "c": False},
                {"t": "Error ಬಂದಾಗ", "c": False}
            ]
        },
        {
            "q": "ಒಂದು condition False ಆದರೆ execute ಆಗಲು ಯಾವ keyword ಬಳಸುತ್ತಾರೆ?",
            "e": "Which keyword is used to execute code if the condition is False?",
            "options": [
                {"t": "else", "c": True},
                {"t": "elif", "c": False},
                {"t": "then", "c": False},
                {"t": "stop", "c": False}
            ]
        },
        {
            "q": "ಅನೇಕ conditions check ಮಾಡಲು ಯಾವುದು ಬಳಸುತ್ತಾರೆ?",
            "e": "What is used to check multiple conditions?",
            "options": [
                {"t": "elif", "c": True},
                {"t": "else if", "c": False},
                {"t": "multi", "c": False},
                {"t": "check", "c": False}
            ]
        },
        {
            "q": "Python ನಲ್ಲಿ 'if' statement ಗೆ ಅನ್ವಯಿಸುವ ಚಿಹ್ನೆ ಯಾವುದು?",
            "e": "Which symbol ends the 'if' statement line?",
            "options": [
                {"t": ": (Colon)", "c": True},
                {"t": "; (Semicolon)", "c": False},
                {"t": ", (Comma)", "c": False},
                {"t": ". (Dot)", "c": False}
            ]
        },
        {
            "q": "What is the output of: if 5 > 3: print('Yes') else: print('No')?",
            "e": "What is the output?",
            "options": [
                {"t": "Yes", "c": True},
                {"t": "No", "c": False},
                {"t": "Error", "c": False},
                {"t": "None", "c": False}
            ]
        }
    ],
    "loops": [
        {
            "q": "ನಿರ್ದಿಷ್ಟ ಬಾರಿ loop execute ಮಾಡಲು ಯಾವುದು ಸೂಕ್ತ?",
            "e": "Which loop is best for executing a specific number of times?",
            "options": [
                {"t": "for loop", "c": True},
                {"t": "while loop", "c": False},
                {"t": "do loop", "c": False},
                {"t": "if loop", "c": False}
            ]
        },
        {
            "q": "Loop ಅನ್ನು ಮಧ್ಯದಲ್ಲೇ ನಿಲ್ಲಿಸಲು ಏನು ಬಳಸುತ್ತಾರೆ?",
            "e": "What is used to stop a loop in the middle?",
            "options": [
                {"t": "break", "c": True},
                {"t": "stop", "c": False},
                {"t": "exit", "c": False},
                {"t": "continue", "c": False}
            ]
        },
        {
            "q": "Loop ನ current iteration skip ಮಾಡಲು ಏನು ಬಳಸುತ್ತಾರೆ?",
            "e": "What is used to skip the current iteration of a loop?",
            "options": [
                {"t": "continue", "c": True},
                {"t": "pass", "c": False},
                {"t": "skip", "c": False},
                {"t": "jump", "c": False}
            ]
        },
        {
            "q": "while loop ಯಾವಾಗ ನಿಲ್ಲುತ್ತದೆ?",
            "e": "When does a while loop stop?",
            "options": [
                {"t": "Condition False ಆದಾಗ", "c": True},
                {"t": "Condition True ಆದಾಗ", "c": False},
                {"t": "ಎಂದಿಗೂ ನಿಲ್ಲುವುದಿಲ್ಲ", "c": False},
                {"t": "1 ಬಾರಿ ಆದ ಮೇಲೆ", "c": False}
            ]
        },
        {
            "q": "range(5) ಯಾವ ಸಂಖ್ಯೆಗಳನ್ನು ನೀಡುತ್ತದೆ?",
            "e": "What numbers does range(5) produce?",
            "options": [
                {"t": "0, 1, 2, 3, 4", "c": True},
                {"t": "1, 2, 3, 4, 5", "c": False},
                {"t": "0 to 5", "c": False},
                {"t": "1 to 5", "c": False}
            ]
        }
    ],
    "data_structures": [
        {
            "q": "List ಅನ್ನು ಯಾವ ಆವರಣದಲ್ಲಿ (brackets) ಬರೆಯಲಾಗುತ್ತದೆ?",
            "e": "Which brackets are used for Lists?",
            "options": [
                {"t": "[ ] (Square Brackets)", "c": True},
                {"t": "{ } (Curly Braces)", "c": False},
                {"t": "( ) (Parentheses)", "c": False},
                {"t": "< > (Angle Brackets)", "c": False}
            ]
        },
        {
            "q": "List ನಲ್ಲಿರುವ data change ಮಾಡಬಹುದೇ (Mutable)?",
            "e": "Is List mutable (changeable)?",
            "options": [
                {"t": "ಹೌದು (Yes)", "c": True},
                {"t": "ಇಲ್ಲ (No)", "c": False},
                {"t": "Sometimes", "c": False},
                {"t": "Only once", "c": False}
            ]
        },
        {
            "q": "Dictionary ಯಲ್ಲಿ data ಹೇಗೆ ಶೇಖರಿಸಲಾಗುತ್ತದೆ?",
            "e": "How is data stored in a Dictionary?",
            "options": [
                {"t": "Key-Value pairs", "c": True},
                {"t": "Index based", "c": False},
                {"t": "Randomly", "c": False},
                {"t": "Variable based", "c": False}
            ]
        },
        {
            "q": "Tuple ಗೂ List ಗೂ ಏನು ವ್ಯತ್ಯಾಸ?",
            "e": "What is the difference between Tuple and List?",
            "options": [
                {"t": "Tuple is immutable (change ಆಗಲ್ಲ)", "c": True},
                {"t": "Tuple is faster", "c": False},
                {"t": "List has no index", "c": False},
                {"t": "No difference", "c": False}
            ]
        },
        {
            "q": "List ನ ಮೊದಲ item ನ index ಏನು?",
            "e": "What is the index of the first item in a List?",
            "options": [
                {"t": "0", "c": True},
                {"t": "1", "c": False},
                {"t": "-1", "c": False},
                {"t": "Start", "c": False}
            ]
        }
    ]
}

def seed():
    print("Seeding full quiz questions...")
    count = 0
    for cat, qs in full_questions.items():
        for q_data in qs:
            if not QuizQuestion.objects.filter(question_kannada=q_data["q"]).exists():
                question = QuizQuestion.objects.create(
                    category=cat,
                    question_kannada=q_data["q"],
                    question_english=q_data["e"],
                    difficulty='easy'
                )
                for i, opt in enumerate(q_data["options"]):
                    QuizOption.objects.create(
                        question=question,
                        option_text_kannada=opt["t"],
                        option_text_english=opt["t"],
                        is_correct=opt["c"],
                        order=i
                    )
                count += 1
                print(f"Added: {q_data['e']}")
            else:
                print(f"Skipped (exists): {q_data['e']}")
    
    print(f"Done! Added {count} new questions.")

if __name__ == "__main__":
    seed()
