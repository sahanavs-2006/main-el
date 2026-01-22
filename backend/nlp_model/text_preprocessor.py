"""
Text Preprocessor for Kannada Input
Cleans, formats, and prepares text for processing
"""
import re
import unicodedata
import logging

logger = logging.getLogger(__name__)


class TextPreprocessor:
    """Preprocessor for cleaning and normalizing Kannada text input"""
    
    def __init__(self):
        # Kannada Unicode range: 0C80-0CFF
        self.kannada_range = r'[\u0C80-\u0CFF]'
        
        # Characters to keep (Kannada, English, numbers, basic punctuation)
        self.allowed_pattern = r'[^\u0C80-\u0CFF\u0020-\u007E\s]'
        
    def preprocess(self, text):
        """
        Main preprocessing pipeline
        
        Args:
            text (str): Raw input text
            
        Returns:
            dict: Contains cleaned_text, original_text, and preprocessing_info
        """
        if not text or not isinstance(text, str):
            return {
                'cleaned_text': '',
                'original_text': text,
                'preprocessing_info': 'Empty or invalid input'
            }
        
        original_text = text
        steps = []
        
        # Step 1: Normalize Unicode
        text = self.normalize_unicode(text)
        steps.append('Unicode normalized')
        
        # Step 2: Remove excessive whitespace
        text = self.normalize_whitespace(text)
        steps.append('Whitespace normalized')
        
        # Step 3: Remove special characters (keep Kannada, English, numbers, basic punctuation)
        text = self.remove_special_characters(text)
        steps.append('Special characters removed')
        
        # Step 4: Fix common speech recognition errors
        text = self.fix_common_errors(text)
        steps.append('Common errors fixed')
        
        # Step 5: Remove extra punctuation
        text = self.normalize_punctuation(text)
        steps.append('Punctuation normalized')
        
        # Step 6: Trim and final cleanup
        text = text.strip()
        steps.append('Final cleanup')
        
        logger.info(f"Preprocessed text: '{original_text}' -> '{text}'")
        
        return {
            'cleaned_text': text,
            'original_text': original_text,
            'preprocessing_info': '; '.join(steps),
            'changed': text != original_text
        }
    
    def normalize_unicode(self, text):
        """
        Normalize Unicode characters to standard form (NFC)
        Handles different Unicode representations of the same character
        """
        try:
            # Normalize to NFC (Canonical Decomposition, followed by Canonical Composition)
            text = unicodedata.normalize('NFC', text)
        except Exception as e:
            logger.warning(f"Unicode normalization failed: {e}")
        return text
    
    def normalize_whitespace(self, text):
        """
        Remove excessive whitespace and normalize to single spaces
        """
        # Split by newlines first to preserve line structure
        lines = text.split('\n')
        
        # Normalize whitespace within each line but PRESERVE indentation
        cleaned_lines = []
        for line in lines:
            if not line.strip():
                continue
                
            # Capture indentation
            match = re.match(r'^(\s*)', line)
            indentation = match.group(1) if match else ''
            
            # Normalize content (strip leading/trailing, collapse internal spaces)
            content = line.strip()
            cleaned_content = re.sub(r'[ \t]+', ' ', content)
            
            # Reconstruct line with original indentation
            cleaned_lines.append(indentation + cleaned_content)
        
        # Join back with newlines
        return '\n'.join(cleaned_lines)
    
    def remove_special_characters(self, text):
        """
        Remove unwanted special characters while keeping Kannada, English, numbers
        """
        # Keep: Kannada (0C80-0CFF), English letters, numbers, spaces, basic punctuation
        # Remove: emojis, symbols, control characters
        
        # Remove control characters except newline and tab
        text = ''.join(char for char in text if unicodedata.category(char)[0] != 'C' or char in '\n\t ')
        
        # Remove emojis and other symbols (keep basic punctuation)
        text = re.sub(r'[^\u0C80-\u0CFF\w\s\.,!?\-\(\)\'\"]+', ' ', text)
        
        return text
    
    def fix_common_errors(self, text):
        """
        Fix common errors from speech recognition or manual input
        """
        # Remove repeated punctuation (e.g., "!!!" -> "!")
        text = re.sub(r'([!?.,])\1+', r'\1', text)
        
        # Fix spacing around punctuation
        text = re.sub(r'\s+([!?.,])', r'\1', text)  # Remove space before punctuation
        text = re.sub(r'([!?.,])([^\s])', r'\1 \2', text)  # Add space after punctuation
        
        # Remove standalone special characters
        text = re.sub(r'\s+[\-_]+\s+', ' ', text)
        
        return text
    
    def normalize_punctuation(self, text):
        """
        Normalize punctuation marks and add commas between sentences
        """
        # Add commas after Kannada sentence-ending patterns
        # Pattern: Kannada verb ending + space + next word
        text = re.sub(r'(ಸಿ|ಯಿರಿ|ಡಿ|ರಿ)\s+([^\s,])', r'\1, \2', text)
        
        # Ensure sentences end with proper punctuation
        if text and not text[-1] in '.!?':
            # Don't add punctuation if text ends with Kannada character
            if not re.search(self.kannada_range + r'$', text):
                pass  # Let it be as is
        
        # Remove trailing punctuation if excessive (but keep commas)
        text = re.sub(r'[.!?]+$', '', text).strip()
        
        return text
    
    def validate_input(self, text):
        """
        Validate if text contains meaningful content
        
        Returns:
            dict: validation result with is_valid and message
        """
        if not text or not text.strip():
            return {
                'is_valid': False,
                'message': 'Text is empty',
                'message_kannada': 'ಪಠ್ಯ ಖಾಲಿಯಾಗಿದೆ'
            }
        
        # Check if text is too short
        if len(text.strip()) < 3:
            return {
                'is_valid': False,
                'message': 'Text is too short (minimum 3 characters)',
                'message_kannada': 'ಪಠ್ಯ ತುಂಬಾ ಚಿಕ್ಕದಾಗಿದೆ (ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳು)'
            }
        
        # Check if text is too long
        if len(text) > 1000:
            return {
                'is_valid': False,
                'message': 'Text is too long (maximum 1000 characters)',
                'message_kannada': 'ಪಠ್ಯ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ (ಗರಿಷ್ಠ 1000 ಅಕ್ಷರಗಳು)'
            }
        
        # Check if text contains at least some Kannada or English characters
        has_kannada = bool(re.search(self.kannada_range, text))
        has_english = bool(re.search(r'[a-zA-Z]', text))
        
        if not has_kannada and not has_english:
            return {
                'is_valid': False,
                'message': 'Text must contain Kannada or English characters',
                'message_kannada': 'ಪಠ್ಯವು ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು'
            }
        
        return {
            'is_valid': True,
            'message': 'Text is valid',
            'has_kannada': has_kannada,
            'has_english': has_english,
            'length': len(text)
        }
    
    def get_text_stats(self, text):
        """
        Get statistics about the text
        
        Returns:
            dict: text statistics
        """
        return {
            'length': len(text),
            'word_count': len(text.split()),
            'has_kannada': bool(re.search(self.kannada_range, text)),
            'kannada_char_count': len(re.findall(self.kannada_range, text)),
            'has_english': bool(re.search(r'[a-zA-Z]', text)),
            'has_numbers': bool(re.search(r'\d', text)),
        }


# Create singleton instance
preprocessor = TextPreprocessor()
