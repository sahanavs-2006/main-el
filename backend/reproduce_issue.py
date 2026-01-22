import requests
import json

url = "http://localhost:8000/api/pipeline/full/"
payload = {
    "kannada_description": "ಸಂಖ್ಯೆ = 5\nಸಂಖ್ಯೆ, \"ರ ಗುಣಾಕಾರ ಕೋಷ್ಟಕ:\" ಅನ್ನು ಮುದ್ರಿಸಿ\nಪ್ರತಿಯೊಂದು ಇ ಇದರಲ್ಲಿ range(1, 11):\n    ಫಲಿತಾಂಶ = ಸಂಖ್ಯೆ * ಇ\n    ಸಂಖ್ಯೆ, \"x\", ಇ, \"=\", ಫಲಿತಾಂಶ ಅನ್ನು ಮುದ್ರಿಸಿ",
    "use_trinket": False,
    "inputs": []
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
