# Enhanced Heuristics Test Examples
# =====================================
# This file contains sample English descriptions and their expected Python outputs.
# Use these to test the enhanced code generator.

## LOOP VARIATIONS
## ================

### 1. While Loop
**Description:** "while x is less than 10"
**Expected Output:**
```python
x = 0
while x < 10:
    print(x)
    x += 1
```

### 2. For Loop with Step
**Description:** "print numbers from 0 to 10 step 2"
**Expected Output:**
```python
for i in range(0, 10 + 1, 2):
    print(i)
```

### 3. Countdown Loop
**Description:** "print numbers from 10 to 1 in descending order"
**Expected Output:**
```python
for i in range(10, 1 - 1, -1):
    print(i)
```

**Description:** "countdown from 5 to 1"
**Expected Output:**
```python
for i in range(5, 1 - 1, -1):
    print(i)
```

---

## INPUT/OUTPUT PATTERNS
## ======================

### 4. Single Number Input
**Description:** "take input from user as a number"
**Expected Output:**
```python
num = int(input('Enter a number: '))
print(num)
```

### 5. String Input
**Description:** "read a name from user"
**Expected Output:**
```python
name = input('Enter name: ')
print(name)
```

### 6. Multiple Inputs
**Description:** "take two numbers as input"
**Expected Output:**
```python
num1 = int(input('Enter number 1: '))
num2 = int(input('Enter number 2: '))
print(num1)
print(num2)
```

### 7. Multiple Inputs with Sum
**Description:** "take three numbers as input and add them"
**Expected Output:**
```python
num1 = int(input('Enter number 1: '))
num2 = int(input('Enter number 2: '))
num3 = int(input('Enter number 3: '))
result = num1 + num2 + num3
print(result)
```

---

## STRING MANIPULATION
## ====================

### 8. Reverse a String
**Description:** "reverse a string"
**Expected Output:**
```python
text = input('Enter a string: ')
reversed_text = text[::-1]
print(reversed_text)
```

### 9. Uppercase Conversion
**Description:** "convert a string to uppercase"
**Expected Output:**
```python
text = input('Enter a string: ')
upper_text = text.upper()
print(upper_text)
```

### 10. Lowercase Conversion
**Description:** "convert a string to lowercase"
**Expected Output:**
```python
text = input('Enter a string: ')
lower_text = text.lower()
print(lower_text)
```

### 11. String Concatenation
**Description:** "concatenate two strings"
**Expected Output:**
```python
str1 = input('Enter first string: ')
str2 = input('Enter second string: ')
result = str1 + str2
print(result)
```

### 12. String Length
**Description:** "find the length of a string"
**Expected Output:**
```python
text = input('Enter a string: ')
length = len(text)
print(length)
```

---

## LIST/ARRAY OPERATIONS
## ======================

### 13. Create a List
**Description:** "create a list with 1, 2, 3"
**Expected Output:**
```python
my_list = [1, 2, 3]
print(my_list)
```

### 14. Append to List
**Description:** "add an element to a list"
**Expected Output:**
```python
my_list = [1, 2, 3]
my_list.append(4)
print(my_list)
```

### 15. Sum of List
**Description:** "find the sum of list elements"
**Expected Output:**
```python
my_list = [1, 2, 3, 4, 5]
total = sum(my_list)
print(total)
```

### 16. Maximum in List
**Description:** "find the maximum value in a list"
**Expected Output:**
```python
my_list = [1, 2, 3, 4, 5]
maximum = max(my_list)
print(maximum)
```

### 17. Minimum in List
**Description:** "find the minimum value in a list"
**Expected Output:**
```python
my_list = [1, 2, 3, 4, 5]
minimum = min(my_list)
print(minimum)
```

### 18. Sort a List
**Description:** "sort a list"
**Expected Output:**
```python
my_list = [5, 2, 8, 1, 9]
my_list.sort()
print(my_list)
```

### 19. Sort Descending
**Description:** "sort a list in descending order"
**Expected Output:**
```python
my_list = [5, 2, 8, 1, 9]
my_list.sort(reverse=True)
print(my_list)
```

### 20. Iterate Through List
**Description:** "loop through a list"
**Expected Output:**
```python
my_list = [1, 2, 3, 4, 5]
for item in my_list:
    print(item)
```

---

## KANNADA EXAMPLES (Translation will be handled automatically)
## =============================================================

These are some Kannada descriptions you can test with:

1. **ಸಂಖ್ಯೆಯನ್ನು ಓದಿ** → "read a number"
2. **ಎರಡು ಸಂಖ್ಯೆಗಳನ್ನು ಇನ್‌ಪುಟ್ ತೆಗೆದುಕೊಳ್ಳಿ** → "take two numbers as input"
3. **ಸ್ಟ್ರಿಂಗ್ ಅನ್ನು ರಿವರ್ಸ್ ಮಾಡಿ** → "reverse a string"
4. **ಲಿಸ್ಟ್ ತಯಾರಿಸಿ** → "create a list"
5. **ಲಿಸ್ಟ್ ಸಾರ್ಟ್ ಮಾಡಿ** → "sort a list"
6. **10 ರಿಂದ 1 ರವರೆಗೆ ಮುದ್ರಿಸಿ** → "print from 10 to 1"
7. **ಸ್ಟ್ರಿಂಗ್ ಉದ್ದ ಕಂಡುಹಿಡಿ** → "find string length"

---

## PATTERN SUMMARY
## ================

Total New Patterns Added: **17**

### Categories:
- **Loops:** 3 patterns (while, step, countdown)
- **Input/Output:** 4 patterns (single input, string input, multiple inputs, input with operations)
- **String Operations:** 5 patterns (reverse, uppercase, lowercase, concatenate, length)
- **List Operations:** 8 patterns (create, append, sum, max, min, sort, sort descending, iterate)

### Total Pattern Coverage:
- **Basic Operations:** 10+ patterns (print, arithmetic, variables, etc.)
- **Control Flow:** 8+ patterns (if, for, while, range, etc.)
- **Data Structures:** 8 patterns (lists/arrays)
- **String Handling:** 5 patterns
- **I/O Operations:** 4 patterns

**Total:** 35+ intelligent code generation patterns without any AI model training!
