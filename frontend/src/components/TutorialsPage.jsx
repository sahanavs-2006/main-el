
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    ChevronRight,
    PlayCircle,
    Code2,
    Lightbulb,
    ArrowLeft,
    CheckCircle2,
    Terminal,
    BookText
} from 'lucide-react';

const tutorials = [
    {
        id: 'intro',
        title: 'ಪೈಥಾನ್ ಪರಿಚಯ',
        subtitle: 'Introduction to Python',
        icon: '🚀',
        description: 'ಪೈಥಾನ್ ಒಂದು ಸುಲಭ ಮತ್ತು ಜನಪ್ರಿಯ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ.',
        content: [
            {
                type: 'text',
                text: 'ಪೈಥಾನ್ (Python) ಇಂದಿನ ದಿನಗಳಲ್ಲಿ ಅತ್ಯಂತ ವೇಗವಾಗಿ ಬೆಳೆಯುತ್ತಿರುವ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆಯಾಗಿದೆ.'
            },
            {
                type: 'text',
                text: 'ಇದು ಕಲಿಯಲು ತುಂಬಾ ಸುಲಭ ಮತ್ತು ಓದಲು ಸರಳವಾಗಿದೆ.'
            },
            {
                type: 'text',
                text: 'ಪೈಥಾನ್ ಅನ್ನು ಡೇಟಾ ಸೈನ್ಸ್, ವೆಬ್ ಡೆವಲಪ್ಮೆಂಟ್, AI ಮತ್ತು ಮೆಷಿನ್ ಲರ್ನಿಂಗ್‌ನಲ್ಲಿ ಬಳಸಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'Google, Instagram, Netflix ಮುಂತಾದ ಕಂಪನಿಗಳು ಪೈಥಾನ್ ಬಳಸುತ್ತವೆ.'
            },
            {
                type: 'tip',
                text: 'ಪೈಥಾನ್ ಅನ್ನು 1991 ರಲ್ಲಿ ಗೈಡೋ ವಾನ್ ರೊಸಮ್ ರವರು ಅಭಿವೃದ್ಧಿಪಡಿಸಿದರು.'
            }
        ]
    },
    {
        id: 'hello-world',
        title: 'ಮೊದಲ ಪ್ರೋಗ್ರಾಂ (Hello World)',
        subtitle: 'Your First Python Program',
        icon: '👋',
        description: 'ಪೈಥಾನ್‌ನಲ್ಲಿ "Hello World" ಎಂದು ಮುದ್ರಿಸುವುದು ಹೇಗೆ ಎಂದು ಕಲಿಯಿರಿ.',
        content: [
            {
                type: 'text',
                text: 'ಯಾವುದೇ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ ಕಲಿಯುವಾಗ ಮೊದಲು "Hello World" ಎಂದು ಮುದ್ರಿಸುವುದು ರೂಢಿ.'
            },
            {
                type: 'text',
                text: 'ಪೈಥಾನ್‌ನಲ್ಲಿ ಇದು ಕೇವಲ ಒಂದು ಸಾಲಿನ ಕೆಲಸ!'
            },
            {
                type: 'code',
                language: 'python',
                code: 'print("ನಮಸ್ಕಾರ ಕರ್ನಾಟಕ!")',
                output: 'ನಮಸ್ಕಾರ ಕರ್ನಾಟಕ!',
                explanation: 'print() ಫಂಕ್ಷನ್ ಔಟ್‌ಪುಟ್ ತೋರಿಸುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: '"print" ಎಂದರೆ ಮುದ್ರಿಸು ಎಂದರ್ಥ.'
            },
            {
                type: 'text',
                text: 'ಬ್ರಾಕೆಟ್ ಒಳಗಡೆ ಏನನ್ನು ಬರೆಯುತ್ತೀರೋ ಅದನ್ನು ಕಂಪ್ಯೂಟರ್ ತೋರಿಸುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'ಟೆಕ್ಸ್ಟ್ ಅನ್ನು ಡಬಲ್ ಕೋಟ್ಸ್ (" ") ಅಥವಾ ಸಿಂಗಲ್ ಕೋಟ್ಸ್ (\' \') ಒಳಗೆ ಬರೆಯಬೇಕು.'
            }
        ]
    },
    {
        id: 'variables',
        title: 'ವೇರಿಯೇಬಲ್ಸ್ ಮತ್ತು ಡೇಟಾ ಟೈಪ್ಸ್',
        subtitle: 'Variables & Data Types',
        icon: '📦',
        description: 'ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಲು ವೇರಿಯೇಬಲ್ಸ್ ಬಳಸಲಾಗುತ್ತದೆ.',
        content: [
            {
                type: 'text',
                text: 'ವೇರಿಯೇಬಲ್ ಎಂದರೆ ಮಾಹಿತಿಯನ್ನು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುವ ಒಂದು ಪೆಟ್ಟಿಗೆ.'
            },
            {
                type: 'text',
                text: 'ನೀವು ಅದಕ್ಕೆ ಯಾವುದೇ ಹೆಸರನ್ನು ನೀಡಬಹುದು.'
            },
            {
                type: 'code',
                language: 'python',
                code: 'ಹೆಸರು = "ರಾಜು"\nವಯಸ್ಸು = 25\nಬೆಲೆ = 99.50',
                output: '(ಮೌಲ್ಯಗಳು ಸಂಗ್ರಹವಾಗಿವೆ)',
                explanation: 'ಮೂರು ವಿಧದ ಡೇಟಾ ಟೈಪ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಬಹುದು.'
            },
            {
                type: 'text',
                text: 'String (ಸ್ಟ್ರಿಂಗ್): ಅಕ್ಷರಗಳು ಮತ್ತು ಪದಗಳು - ಉದಾ: "ರಾಜು"'
            },
            {
                type: 'text',
                text: 'Integer (ಇಂಟಿಜರ್): ಪೂರ್ಣ ಸಂಖ್ಯೆಗಳು - ಉದಾ: 25'
            },
            {
                type: 'text',
                text: 'Float (ಫ್ಲೋಟ್): ದಶಮಾಂಶ ಸಂಖ್ಯೆಗಳು - ಉದಾ: 99.50'
            },
            {
                type: 'text',
                text: 'ಪೈಥಾನ್ ಡೇಟಾ ಟೈಪ್ ಅನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಗುರುತಿಸುತ್ತದೆ.'
            }
        ]
    },
    {
        id: 'conditionals',
        title: 'ಕಂಡೀಷನಲ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್ಸ್ (If-Else)',
        subtitle: 'Control Flow with If-Else',
        icon: '⚖️',
        description: 'ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು if-else ಬಳಸಲಾಗುತ್ತದೆ.',
        content: [
            {
                type: 'text',
                text: 'ಜೀವನದಲ್ಲಿ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳುವಂತೆ ಪ್ರೋಗ್ರಾಮಿಂಗ್‌ನಲ್ಲೂ ಕೂಡ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಕೆಲಸ ಮಾಡಬೇಕಾಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'if ಎಂದರೆ "ಒಂದು ವೇಳೆ" ಎಂದರ್ಥ - ಕಂಡೀಶನ್ ನಿಜವಾದರೆ ಕೋಡ್ ರನ್ ಆಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'else ಎಂದರೆ "ಇಲ್ಲದಿದ್ದರೆ" ಎಂದರ್ಥ - if ಕಂಡೀಶನ್ ತಪ್ಪಾದರೆ else ಬ್ಲಾಕ್ ರನ್ ಆಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'elif ಎಂದರೆ "else if" - ಹೆಚ್ಚುವರಿ ಕಂಡೀಶನ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'code',
                language: 'python',
                code: 'ವಯಸ್ಸು = 18\nif ವಯಸ್ಸು >= 18:\n    print("ನೀವು ಮತದಾನ ಮಾಡಬಹುದು")\nelse:\n    print("ನೀವು ಇನ್ನು ಮೈನರ್")',
                output: 'ನೀವು ಮತದಾನ ಮಾಡಬಹುದು',
                explanation: 'ವಯಸ್ಸು 18 ಆಗಿರುವುದರಿಂದ if ಕಂಡೀಶನ್ ನಿಜವಾಗಿದೆ.'
            },
            {
                type: 'text',
                text: '>= ಎಂದರೆ "ಹೆಚ್ಚು ಅಥವಾ ಸಮ" (Greater than or equal to).'
            },
            {
                type: 'text',
                text: '== ಎಂದರೆ "ಸಮ" (Equal to), != ಎಂದರೆ "ಸಮವಲ್ಲ" (Not equal to).'
            },
            {
                type: 'tip',
                text: 'Indent (4 ಸ್ಪೇಸ್) ಬಿಡುವುದು ಪೈಥಾನ್‌ನಲ್ಲಿ ಕಡ್ಡಾಯ! ಇಲ್ಲದಿದ್ದರೆ ಎರರ್ ಬರುತ್ತದೆ.'
            }
        ]
    },
    {
        id: 'loops',
        title: 'ಲೂಪ್ಸ್ (Loops - For & While)',
        subtitle: 'Repeating Tasks with Loops',
        icon: '🔄',
        description: 'ಪುನರಾವರ್ತಿತ ಕೆಲಸಗಳನ್ನು ಮಾಡಲು ಲೂಪ್‌ಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.',
        content: [
            {
                type: 'text',
                text: 'ಒಂದೇ ಕೆಲಸವನ್ನು ಪದೇ ಪದೇ ಮಾಡಬೇಕಾದಾಗ ನಾವು ಲೂಪ್‌ಗಳನ್ನು ಬಳಸುತ್ತೇವೆ.'
            },
            {
                type: 'text',
                text: 'ಪೈಥಾನ್‌ನಲ್ಲಿ ಎರಡು ಮುಖ್ಯ ಲೂಪ್‌ಗಳಿವೆ: for ಲೂಪ್ ಮತ್ತು while ಲೂಪ್.'
            },
            {
                type: 'text',
                text: 'for ಲೂಪ್: ನಿರ್ದಿಷ್ಟ ಸಂಖ್ಯೆಯ ಬಾರಿ ಕೆಲಸ ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'code',
                language: 'python',
                code: 'for ಸಂಖ್ಯೆ in range(5):\n    print("ನಮಸ್ಕಾರ", ಸಂಖ್ಯೆ)',
                output: 'ನಮಸ್ಕಾರ 0\nನಮಸ್ಕಾರ 1\nನಮಸ್ಕಾರ 2\nನಮಸ್ಕಾರ 3\nನಮಸ್ಕಾರ 4',
                explanation: 'range(5) ಎಂದರೆ 0, 1, 2, 3, 4 - ಒಟ್ಟು 5 ಬಾರಿ ರನ್ ಆಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'range(1, 6) ಎಂದರೆ 1 ರಿಂದ 5 ರವರೆಗೆ (6 ಸೇರಿಲ್ಲ).'
            },
            {
                type: 'text',
                text: 'while ಲೂಪ್: ಕಂಡೀಶನ್ ನಿಜವಿರುವವರೆಗೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'break: ಲೂಪ್ ಅನ್ನು ಮಧ್ಯದಲ್ಲೇ ನಿಲ್ಲಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'continue: ಪ್ರಸ್ತುತ ಐಟರೇಶನ್ ಅನ್ನು ಬಿಟ್ಟು ಮುಂದಿನದಕ್ಕೆ ಹೋಗಲು ಬಳಸಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'tip',
                text: 'ಅನಂತ ಲೂಪ್ ಆಗದಂತೆ ಎಚ್ಚರ! while ಲೂಪ್‌ನಲ್ಲಿ ಕಂಡೀಶನ್ ಬದಲಾಗಬೇಕು.'
            }
        ]
    },
    {
        id: 'lists',
        title: 'ಲಿಸ್ಟ್ಸ್ (Lists)',
        subtitle: 'Working with Collections',
        icon: '📂',
        description: 'ಹಲವು ಮಾಹಿತಿಗಳನ್ನು ಒಂದೇ ಕಡೆ ಸಂಗ್ರಹಿಸಲು ಲಿಸ್ಟ್ ಬಳಸಲಾಗುತ್ತದೆ.',
        content: [
            {
                type: 'text',
                text: 'ಲಿಸ್ಟ್ ಎನ್ನುವುದು ಹಲವು ಐಟಂಗಳ ಸಂಗ್ರಹ (Collection).'
            },
            {
                type: 'text',
                text: 'ಲಿಸ್ಟ್ ಅನ್ನು [ ] ಬ್ರಾಕೆಟ್ ಒಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'ಲಿಸ್ಟ್‌ನಲ್ಲಿ ಯಾವುದೇ ರೀತಿಯ ಡೇಟಾ ಇಡಬಹುದು - ಸ್ಟ್ರಿಂಗ್, ನಂಬರ್, ಇತ್ಯಾದಿ.'
            },
            {
                type: 'code',
                language: 'python',
                code: 'ಹಣ್ಣುಗಳು = ["ಸೇಬು", "ಬಾಳೆಹಣ್ಣು", "ಮಾವು"]\nprint(ಹಣ್ಣುಗಳು[0])',
                output: 'ಸೇಬು',
                explanation: 'ಮೊದಲ ಐಟಂನ ಇಂಡೆಕ್ಸ್ 0 ಆಗಿರುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'append(): ಲಿಸ್ಟ್‌ಗೆ ಹೊಸ ಐಟಂ ಸೇರಿಸಲು ಬಳಸಿ.'
            },
            {
                type: 'text',
                text: 'remove(): ಲಿಸ್ಟ್‌ನಿಂದ ಐಟಂ ತೆಗೆಯಲು ಬಳಸಿ.'
            },
            {
                type: 'text',
                text: 'len(): ಲಿಸ್ಟ್‌ನಲ್ಲಿ ಎಷ್ಟು ಐಟಂಗಳಿವೆ ಎಂದು ತಿಳಿಯಲು ಬಳಸಿ.'
            },
            {
                type: 'tip',
                text: 'ಲಿಸ್ಟ್ ಇಂಡೆಕ್ಸ್ ಯಾವಾಗಲೂ 0 ಯಿಂದ ಪ್ರಾರಂಭ! ಕೊನೆಯ ಐಟಂಗೆ -1 ಬಳಸಿ.'
            }
        ]
    },
    {
        id: 'functions',
        title: 'ಫಂಕ್ಷನ್ಸ್ (Functions)',
        subtitle: 'Reusable Code Blocks',
        icon: '🛠️',
        description: 'ಕೋಡ್ ಅನ್ನು ಪುನರ್ಬಳಕೆ ಮಾಡಲು ಫಂಕ್ಷನ್ ಬಳಸಲಾಗುತ್ತದೆ.',
        content: [
            {
                type: 'text',
                text: 'ಫಂಕ್ಷನ್ ಎಂದರೆ ಒಂದು ನಿರ್ದಿಷ್ಟ ಕೆಲಸ ಮಾಡುವ ಕೋಡ್‌ನ ಭಾಗ.'
            },
            {
                type: 'text',
                text: 'ಒಮ್ಮೆ ಬರೆದು ಎಷ್ಟು ಬಾರಿಯಾದರೂ ಬಳಸಬಹುದು (Reusability).'
            },
            {
                type: 'text',
                text: 'def ಕೀವರ್ಡ್ ಬಳಸಿ ಫಂಕ್ಷನ್ ಅನ್ನು ಡಿಫೈನ್ ಮಾಡಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'code',
                language: 'python',
                code: 'def ಸ್ವಾಗತ(ಹೆಸರು):\n    print("ಹಲೋ", ಹೆಸರು)\n\nಸ್ವಾಗತ("ರಾಜು")',
                output: 'ಹಲೋ ರಾಜು',
                explanation: 'ಹೆಸರು ಎಂಬುದು Parameter, "ರಾಜು" ಎಂಬುದು Argument.'
            },
            {
                type: 'text',
                text: 'Parameter: ಫಂಕ್ಷನ್ ಡೆಫಿನಿಷನ್‌ನಲ್ಲಿ ಇರುವ ವೇರಿಯೇಬಲ್.'
            },
            {
                type: 'text',
                text: 'Argument: ಫಂಕ್ಷನ್ ಕಾಲ್ ಮಾಡುವಾಗ ಕಳುಹಿಸುವ ಮೌಲ್ಯ.'
            },
            {
                type: 'text',
                text: 'return: ಫಂಕ್ಷನ್‌ನಿಂದ ಮೌಲ್ಯವನ್ನು ಹಿಂದಿರುಗಿಸಲು ಬಳಸಿ.'
            },
            {
                type: 'tip',
                text: 'ಫಂಕ್ಷನ್ ಹೆಸರು ಸ್ಪಷ್ಟವಾಗಿರಲಿ! ಏನು ಮಾಡುತ್ತದೆ ಎಂದು ಹೆಸರಿನಲ್ಲೇ ತಿಳಿಯಬೇಕು.'
            }
        ]
    },
    {
        id: 'strings',
        title: 'ಸ್ಟ್ರಿಂಗ್ಸ್ (Strings)',
        subtitle: 'Mastering Text Manipulation',
        icon: '📝',
        description: 'ಅಕ್ಷರಗಳು ಮತ್ತು ವಾಕ್ಯಗಳೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವುದು ಹೇಗೆ ಎಂದು ತಿಳಿಯಿರಿ.',
        content: [
            {
                type: 'text',
                text: 'ಸ್ಟ್ರಿಂಗ್ ಎಂದರೆ ಅಕ್ಷರಗಳ ಗುಂಪು (Sequence of characters).'
            },
            {
                type: 'text',
                text: 'ಡಬಲ್ ಕೋಟ್ಸ್ (" ") ಅಥವಾ ಸಿಂಗಲ್ ಕೋಟ್ಸ್ (\' \') ಒಳಗೆ ಬರೆಯಿರಿ.'
            },
            {
                type: 'code',
                language: 'python',
                code: 'ಸಂದೇಶ = "ಕನ್ನಡ ಕಲಿಯಿರಿ"\nprint(ಸಂದೇಶ.upper())\nprint(len(ಸಂದೇಶ))',
                output: 'ಕನ್ನಡ ಕಲಿಯಿರಿ\n12',
                explanation: 'upper() ಮತ್ತು len() ಸ್ಟ್ರಿಂಗ್ ಮೆಥಡ್‌ಗಳು.'
            },
            {
                type: 'text',
                text: '.upper(): ಎಲ್ಲಾ ಅಕ್ಷರಗಳನ್ನು ದೊಡ್ಡದಾಗಿ (UPPERCASE) ಮಾಡುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: '.lower(): ಎಲ್ಲಾ ಅಕ್ಷರಗಳನ್ನು ಸಣ್ಣದಾಗಿ (lowercase) ಮಾಡುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'len(): ಸ್ಟ್ರಿಂಗ್‌ನ ಉದ್ದ (ಅಕ್ಷರಗಳ ಸಂಖ್ಯೆ) ಹೇಳುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: '+ ಚಿಹ್ನೆ: ಎರಡು ಸ್ಟ್ರಿಂಗ್‌ಗಳನ್ನು ಜೋಡಿಸಲು (Concatenation).'
            },
            {
                type: 'tip',
                text: 'ಸ್ಟ್ರಿಂಗ್ ಇಮ್ಯುಟೆಬಲ್ (Immutable) - ಒಮ್ಮೆ ಬರೆದ ನಂತರ ಬದಲಾಯಿಸಲಾಗುವುದಿಲ್ಲ!'
            }
        ]
    },
    {
        id: 'dictionaries',
        title: 'ಡಿಕ್ಷ್‌ನರಿಗಳು (Dictionaries)',
        subtitle: 'Key-Value Data Storage',
        icon: '📚',
        description: 'ಡೇಟಾವನ್ನು ಕೀ-ವ್ಯಾಲ್ಯೂ ಜೋಡಿಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸುವುದು.',
        content: [
            {
                type: 'text',
                text: 'ಡಿಕ್ಷ್‌ನರಿ ಎಂದರೆ ಕೀ-ವ್ಯಾಲ್ಯೂ ಜೋಡಿಗಳ ಸಂಗ್ರಹ.'
            },
            {
                type: 'text',
                text: '{ } ಬ್ರಾಕೆಟ್ ಒಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ.'
            },
            {
                type: 'text',
                text: 'ಪ್ರತಿ ಐಟಂ "ಕೀ": "ವ್ಯಾಲ್ಯೂ" ಫಾರ್ಮ್ಯಾಟ್‌ನಲ್ಲಿರುತ್ತದೆ.'
            },
            {
                type: 'code',
                language: 'python',
                code: 'ವಿದ್ಯಾರ್ಥಿ = {\n    "ಹೆಸರು": "ರಾಜು",\n    "ವಯಸ್ಸು": 15,\n    "ಶಾಲೆ": "ಕೇಂದ್ರೀಯ ವಿದ್ಯಾಲಯ"\n}\nprint(ವಿದ್ಯಾರ್ಥಿ["ಹೆಸರು"])',
                output: 'ರಾಜು',
                explanation: '"ಹೆಸರು" ಕೀ ಬಳಸಿ "ರಾಜು" ವ್ಯಾಲ್ಯೂ ಪಡೆಯುತ್ತಿದ್ದೇವೆ.'
            },
            {
                type: 'text',
                text: 'ಕೀ ಯುನೀಕ್ ಆಗಿರಬೇಕು - ಒಂದೇ ಕೀ ಎರಡು ಬಾರಿ ಇರಲಾಗದು.'
            },
            {
                type: 'text',
                text: '.keys(): ಎಲ್ಲಾ ಕೀಗಳನ್ನು ಪಡೆಯಲು.'
            },
            {
                type: 'text',
                text: '.values(): ಎಲ್ಲಾ ವ್ಯಾಲ್ಯೂಗಳನ್ನು ಪಡೆಯಲು.'
            },
            {
                type: 'tip',
                text: 'ಡಿಕ್ಷ್‌ನರಿ ತುಂಬಾ ವೇಗವಾಗಿ ಡೇಟಾ ಹುಡುಕಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ!'
            }
        ]
    }
];

const TutorialsPage = ({ onBack, onTryCode }) => {
    const [selectedTutorial, setSelectedTutorial] = useState(null);

    const handleTutorialSelect = (tutorial) => {
        setSelectedTutorial(tutorial);
    };

    const handleBackToList = () => {
        setSelectedTutorial(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">


                <AnimatePresence mode="wait">
                    {!selectedTutorial ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="mb-12 text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-kannada">
                                    ಪೈಥಾನ್ ಟ್ಯೂಟೋರಿಯಲ್ಸ್
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl font-medium mx-auto">
                                    Learn Python programming step-by-step in your mother tongue. Compact, clear, and easy to understand.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tutorials.map((tutorial, index) => (
                                    <motion.button
                                        key={tutorial.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleTutorialSelect(tutorial)}
                                        className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white dark:bg-black hover:bg-gray-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/20 shadow-xl dark:shadow-none hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden h-full"
                                    >
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold text-black dark:text-white mb-2 font-kannada">
                                                {tutorial.title}
                                            </h3>
                                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                                                {tutorial.subtitle}
                                            </p>
                                        </div>

                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
                        >
                            {/* Tutorial Cover */}
                            <div className="relative bg-white dark:bg-slate-900 p-8 md:p-10 text-slate-900 dark:text-white overflow-hidden border-b border-slate-100 dark:border-white/5">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    {/* <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-4xl shadow-lg border border-slate-100 dark:border-white/5 animate-bounce-slow">
                                        {selectedTutorial.icon}
                                    </div> */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-3">
                                            <span className="px-3 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-bold uppercase tracking-widest border border-teal-500/20">
                                                Python Basics
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                                Beginner
                                            </span>
                                        </div>
                                        <h1 className="text-xl md:text-2xl font-black mb-2 font-kannada tracking-tight text-slate-900 dark:text-white">
                                            {selectedTutorial.title}
                                        </h1>
                                        <p className="text-sm md:text-base opacity-70 font-medium max-w-2xl text-slate-600 dark:text-slate-400">
                                            {selectedTutorial.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Divider Line */}
                            <div className="h-px bg-slate-900 dark:bg-white" />

                            {/* Tutorial Body */}
                            <div className="p-8 md:p-12 space-y-10 bg-white dark:bg-slate-900">
                                {/* Summary Description moved from card */}
                                <div className="p-6 border border-slate-100 dark:border-white/5 rounded-2xl mb-8 bg-slate-50/30 dark:bg-white/5">
                                    <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-kannada font-bold italic">
                                        "{selectedTutorial.description}"
                                    </p>
                                </div>
                                {selectedTutorial.content.map((block, idx) => {
                                    if (block.type === 'text') {
                                        return (
                                            <div key={idx} className="flex gap-4 items-start">
                                                <div className="mt-2 w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 flex-shrink-0" />
                                                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-kannada font-medium">
                                                    {block.text}
                                                </p>
                                            </div>
                                        );
                                    }
                                    if (block.type === 'code') {
                                        return (
                                            <div key={idx} className="relative">
                                                <div className="bg-[#0d1117] rounded-xl overflow-hidden shadow-lg">
                                                    <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/10">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                                        </div>
                                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Python 3.x</span>
                                                    </div>
                                                    <div className="p-6 overflow-x-auto">
                                                        <code className="text-blue-300 font-mono text-lg block whitespace-pre">
                                                            {block.code}
                                                        </code>
                                                    </div>
                                                </div>
                                                {block.output && (
                                                    <div className="mt-3 bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                                        <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-2 tracking-widest">Output:</p>
                                                        <code className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{block.output}</code>
                                                    </div>
                                                )}
                                                {block.explanation && (
                                                    <div className="mt-4 flex gap-4 items-start p-5">
                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 flex-shrink-0" />
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-kannada font-bold">
                                                            {block.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    if (block.type === 'tip') {
                                        return (
                                            <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-6 flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center flex-shrink-0">
                                                    <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-amber-800 dark:text-amber-400 font-bold mb-1 uppercase tracking-widest text-xs">ಮಾಹಿತಿ (Tip)</h4>
                                                    <p className="text-slate-700 dark:text-slate-300 font-kannada font-bold italic">
                                                        {block.text}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                                {/* Footer Navigation */}
                                <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex justify-center">
                                    <button
                                        onClick={handleBackToList}
                                        className="px-8 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                                    >
                                        More Tutorials
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TutorialsPage;
