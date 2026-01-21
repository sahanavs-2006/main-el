# Bridging Language Barriers in Coding: An NLP-Powered Tool

An innovative web application that enables users to write coding algorithms in Kannada and execute them as Python code using NLP and machine translation.

## 🎯 Project Overview

This project aims to bridge the language barrier in programming education by allowing users to write algorithms in their native language (Kannada) and automatically translate and execute them as Python code. The system combines speech recognition, machine translation, NLP models, and embedded coding environments to create an accessible programming learning platform.

## 🏗️ System Architecture

The application follows a multi-stage pipeline:

1. **Input Stage**: Users can input Kannada algorithms via:
   - Speech Recognition
   - Virtual Keyboard

2. **Translation Stage**: Kannada text is translated to English using Google Translator (deep_translator module)

3. **Code Generation Stage**: NLP Model (CodeT5 fine-tuned on custom dataset) is hosted on Hugging Face Inference API and converts natural language to Python code

4. **Execution Stage**: Generated code is executed in Trinket IO (Embedded Coding Environment)

5. **Error Handling**: Any execution errors are caught, translated back to Kannada, and displayed to the user

6. **Output Stage**: Results are presented through the Django and React web application

## 🛠️ Technology Stack

### Backend
- **Django**: Web framework for backend API and business logic
- **deep_translator**: Google Translate integration for Kannada-English translation
- **Hugging Face Inference API**: Serves the fine-tuned CodeT5 model
- **Trinket IO**: Embedded Python execution environment

### Frontend
- **React**: Modern UI framework for interactive web interface
- **Speech Recognition API**: For voice input capability
- **Virtual Keyboard**: For Kannada text input

### AI/ML
- **NLP Model**: CodeT5 with HuggingFace Inference API fallback
- **Smart Heuristics**: 35+ pattern-matching rules for common programming constructs
- **Hybrid Approach**: Combines AI generation with deterministic logic for reliability

## 📋 Features

### Core Capabilities
- ✅ Multi-modal input (Speech & Keyboard)
- ✅ Kannada language support for algorithm description
- ✅ Real-time translation and code generation
- ✅ Interactive code execution environment
- ✅ Error messages in Kannada for better understanding
- ✅ Programming tutorials and quizzes
- ✅ Educational content display

### Code Generation Patterns (35+ Supported)

**Loop Variations:**
- For loops with custom ranges
- While loops with conditions
- For loops with step/increment
- Countdown/descending loops
- Even/odd number filtering

**Input/Output Operations:**
- Single number input
- String/text input
- Multiple inputs (2-3 numbers)
- Input with arithmetic operations

**String Manipulation:**
- String reversal
- Uppercase/lowercase conversion
- String concatenation
- Length calculation

**List/Array Operations:**
- List creation
- Element insertion (append)
- Sum of elements
- Finding max/min values
- Sorting (ascending/descending)
- List iteration

**Arithmetic & Logic:**
- Basic operations (add, subtract, multiply, divide)
- Conditional statements (if-then)
- Variable assignments
- Print statements
- Function definitions

## 🚀 Getting Started

### Prerequisites

```bash
# Python 3.8+
# Node.js 14+
# npm or yarn
```

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

## 📁 Project Structure

```
.
├── backend/                # Django backend
│   ├── api/               # API endpoints
│   ├── translator/        # Translation module
│   ├── nlp_model/         # CodeT5 model integration
│   └── manage.py
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── App.js
│   └── package.json
├── models/                # Trained NLP models
├── dataset/              # Training dataset
└── README.md
```

## 🔄 Workflow

1. User accesses the web application
2. Programming concepts, tutorials, and quizzes are displayed
3. User enters algorithm description in Kannada (via speech or keyboard)
4. System translates Kannada to English
5. NLP model generates Python code from English description
6. Code is executed in Trinket IO environment
7. Results or errors are displayed (errors translated back to Kannada)
8. User can iterate and refine the algorithm

## 📝 API Endpoints

```
POST /api/translate/           # Translate Kannada to English
POST /api/generate-code/       # Generate Python code from description (proxies to Hugging Face model)
POST /api/execute-code/        # Execute code in Trinket IO
GET  /api/tutorials/           # Get programming tutorials
GET  /api/quizzes/             # Get programming quizzes
```

### Hugging Face model call (backend -> HF Inference API)

```bash
curl -X POST "$HF_API_URL" \
   -H "Authorization: Bearer $HF_API_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"inputs": "Write a Python function to sum a list"}'
```

Example Python snippet (Django service):

```python
import os, requests

HF_API_URL = os.environ["HF_API_URL"]
HF_API_TOKEN = os.environ["HF_API_TOKEN"]

def generate_code(prompt: str) -> str:
      headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
      resp = requests.post(HF_API_URL, headers=headers, json={"inputs": prompt}, timeout=30)
      resp.raise_for_status()
      return resp.json()[0]["generated_text"]
```

## 🎓 Use Cases

- **Programming Education**: Learn coding concepts in native language
- **Algorithm Practice**: Write and test algorithms in Kannada
- **Accessibility**: Make programming education more accessible to non-English speakers
- **Interactive Learning**: Immediate feedback on code execution

## 🔧 Configuration

### Environment Variables

```env
# Backend (.env)
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=your_database_url
HF_API_URL=https://api-inference.huggingface.co/models/<your-namespace>/<model-name>
HF_API_TOKEN=your_hf_api_token

# Frontend (.env)
REACT_APP_API_URL=http://localhost:8000/api
```

## 🧪 Testing

```bash
# Backend tests
python manage.py test

# Frontend tests
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name/Team Name

## 🙏 Acknowledgments

- CodeT5 model by Salesforce Research
- Google Translate API
- Trinket IO for embedded code execution
- Django and React communities

## 📧 Contact

For questions or support, please contact: your.email@example.com

## 🗺️ Roadmap

- [ ] Support for additional Indian languages
- [ ] More programming languages beyond Python
- [ ] Advanced code optimization suggestions
- [ ] Collaborative coding features
- [ ] Mobile application
- [ ] Offline mode support

---

**Note**: This project is part of research in making programming education more accessible across language barriers.
