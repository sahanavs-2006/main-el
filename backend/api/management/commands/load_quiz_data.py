from django.core.management.base import BaseCommand
from api.models import QuizQuestion, QuizOption

class Command(BaseCommand):
    help = 'Load sample quiz questions in Kannada'

    def handle(self, *args, **options):
        # Sample Quiz Data
        sample_questions = [
            {
                'question_kannada': 'Python ನಲ್ಲಿ ವೇರಿಯೇಬಲ್ ಅನ್ನು ಹೇಗೆ ಘೋಷಿಸುತ್ತೇವೆ?',
                'question_english': 'How do you declare a variable in Python?',
                'difficulty': 'easy',
                'category': 'basic_syntax',
                'options': [
                    {'text_kn': 'var x = 5', 'text_en': 'var x = 5', 'correct': False, 'explanation_kn': 'ಇದು JavaScript ವಾಕ್ಯವಿಶ್ಯ'},
                    {'text_kn': 'x = 5', 'text_en': 'x = 5', 'correct': True, 'explanation_kn': 'Python ನಲ್ಲಿ ಸರಳ ನಿಯೋಜನೆ ಸಾಕು'},
                    {'text_kn': 'int x = 5;', 'text_en': 'int x = 5;', 'correct': False, 'explanation_kn': 'ಇದು C/C++ ನ ವಾಕ್ಯ'},
                    {'text_kn': 'declare x = 5', 'text_en': 'declare x = 5', 'correct': False, 'explanation_kn': 'Python ಈ ಕೀವರ್ಡ್ ಅನ್ನು ಸಮರ್ಥಿಸುವುದಿಲ್ಲ'},
                ]
            },
            {
                'question_kannada': 'for ಲೂಪ್ ನ ಮೂಲ ರಚನೆ ಏನು?',
                'question_english': 'What is the basic structure of a for loop?',
                'difficulty': 'easy',
                'category': 'loops',
                'options': [
                    {'text_kn': 'for i in range(10):', 'text_en': 'for i in range(10):', 'correct': True, 'explanation_kn': '1 ರಿಂದ 9 ಅನ್ನು ಪುನರಾವರ್ತಿಸುತ್ತದೆ'},
                    {'text_kn': 'for(i=0; i<10; i++)', 'text_en': 'for(i=0; i<10; i++)', 'correct': False, 'explanation_kn': 'ಇದು C ವಾಕ್ಯ'},
                    {'text_kn': 'foreach x in list', 'text_en': 'foreach x in list', 'correct': False, 'explanation_kn': 'C# ನಲ್ಲಿ ಬಳಸುತ್ತೇವೆ'},
                    {'text_kn': 'loop x = 1 to 10', 'text_en': 'loop x = 1 to 10', 'correct': False, 'explanation_kn': 'ಯಾವುದೇ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ ಈ ವಾಕ್ಯ ಸಮರ್ಥಿಸುವುದಿಲ್ಲ'},
                ]
            },
            {
                'question_kannada': 'if-else ಷರತ್ತಿನ ಉದ್ದೇಶವೇನು?',
                'question_english': 'What is the purpose of if-else condition?',
                'difficulty': 'easy',
                'category': 'conditionals',
                'options': [
                    {'text_kn': 'ಒಂದು ಷರತ್ತಿನ ಆಧಾರದ ಮೇಲೆ ಕೋಡ್ ನಿರ್ಬಾಹಿಸುವುದು', 'text_en': 'Execute code based on a condition', 'correct': True, 'explanation_kn': 'ಸರಿಯಾಗಿ ವಿವರಿಸಲಾಗಿದೆ'},
                    {'text_kn': 'ಕೋಡ್ ಅನ್ನು ಪುನರಾವರ್ತಿಸುವುದು', 'text_en': 'Repeat code', 'correct': False, 'explanation_kn': 'ಇದು ಲೂಪ್ ನ ಉದ್ದೇಶ'},
                    {'text_kn': 'ಫಂಕ್ಷನ್ ಕರೆ ಮಾಡುವುದು', 'text_en': 'Call a function', 'correct': False, 'explanation_kn': 'ಇದು ಫಂಕ್ಷನ್ ನ ಉದ್ದೇಶ'},
                    {'text_kn': 'ವೇರಿಯೇಬಲ್ ಘೋಷಿಸುವುದು', 'text_en': 'Declare a variable', 'correct': False, 'explanation_kn': 'ಇದು ವೇರಿಯೇಬಲ್ ಘೋಷಣೆಯ ಉದ್ದೇಶ'},
                ]
            },
            {
                'question_kannada': 'ಫಂಕ್ಷನ್ ನ ಉದ್ದೇಶವೇನು?',
                'question_english': 'What is the purpose of a function?',
                'difficulty': 'medium',
                'category': 'functions',
                'options': [
                    {'text_kn': 'ಕೋಡ್ ವಿಭಾಗಗಳನ್ನು ಪುನರ ಬಳಕೆಯೋಗ್ಯ ಮಾಡುವುದು', 'text_en': 'Make code reusable and organized', 'correct': True, 'explanation_kn': 'ಫಂಕ್ಷನ್ ಕೋಡ್ ಅನ್ನು ಪುನರ್ಬಳಕೆ ಮತ್ತು ಸಂಘಟನೆ ಮಾಡುವುದು'},
                    {'text_kn': 'ಲೂಪ್ ನೋಂದಿಸುವುದು', 'text_en': 'Register a loop', 'correct': False, 'explanation_kn': 'ಲೂಪ್ ಲೋಗ್ ವೇರಿಯೇಬಲ್ ಅವಲಂಬಿಸುತ್ತದೆ'},
                    {'text_kn': 'ಡೇಟಾಬೇಸ್ ಕನೆಕ್ಟ್ ಮಾಡುವುದು', 'text_en': 'Connect to database', 'correct': False, 'explanation_kn': 'ಇದು ಫಂಕ್ಷನ್ ನ ಉದ್ದೇಶ ಅಲ್ಲ'},
                    {'text_kn': 'ವೈರಸ್ ತಳೆ ಮಾಡುವುದು', 'text_en': 'Prevent viruses', 'correct': False, 'explanation_kn': 'ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ ವೈರಸ್ ತಡೆಯುವುದಿಲ್ಲ'},
                ]
            },
            {
                'question_kannada': 'Python ರಲ್ಲಿ ಪಟ್ಟಿ (list) ಎನ್ನುವುದೇನು?',
                'question_english': 'What is a list in Python?',
                'difficulty': 'medium',
                'category': 'data_structures',
                'options': [
                    {'text_kn': 'ಅವ್ಯವಸ್ಥಿತ ಪ್ರಕಾರದ ಡೇಟಾ ರಚನೆ', 'text_en': 'An ordered collection of elements', 'correct': True, 'explanation_kn': 'ಪಟ್ಟಿ ಅವ್ಯವಸ್ಥಿತ ಮತ್ತು ಬದಲಾಯಿಸಬಹುದಾದ'},
                    {'text_kn': 'ಒಂದೇ ಪ್ರಕಾರದ ಮೂಲಗಳ ವರ್ಣಮಾಲೆ', 'text_en': 'A string of same types', 'correct': False, 'explanation_kn': 'ಪಟ್ಟಿ ವಿವಿಧ ಪ್ರಕಾರಗಳನ್ನು ಹೊಂದಬಹುದು'},
                    {'text_kn': 'ಸ್ಥಿರ ಸಂಗ್ರಹ', 'text_en': 'A fixed collection', 'correct': False, 'explanation_kn': 'ಪಟ್ಟಿ ಬದಲಾಯಿಸಬಹುದಾದ'},
                    {'text_kn': 'ಡೈಕ್ಷನರಿ', 'text_en': 'A dictionary', 'correct': False, 'explanation_kn': 'ಡೈಕ್ಷನರಿ ವಿಭಿನ್ನ ರಚನೆ'},
                ]
            }
        ]

        created_count = 0
        for q in sample_questions:
            question = QuizQuestion.objects.create(
                question_kannada=q['question_kannada'],
                question_english=q['question_english'],
                difficulty=q['difficulty'],
                category=q['category']
            )
            
            for i, opt in enumerate(q['options']):
                QuizOption.objects.create(
                    question=question,
                    option_text_kannada=opt['text_kn'],
                    option_text_english=opt['text_en'],
                    is_correct=opt['correct'],
                    explanation_kannada=opt['explanation_kn'],
                    order=i
                )
            
            created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {created_count} quiz questions with options'))
