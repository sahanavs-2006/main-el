# -*- coding: utf-8 -*-
code = "ಸಂಖ್ಯೆ = 5\nprint(ಸಂಖ್ಯೆ)"
try:
    exec(code)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
