from deep_translator import GoogleTranslator
import logging

logger = logging.getLogger(__name__)

class KannadaTranslator:
    """Handles translation between Kannada and English using Google Translate."""
    
    def __init__(self):
        """Initialize the translator."""
        self.kannada_to_english = GoogleTranslator(source='kn', target='en')
        self.english_to_kannada = GoogleTranslator(source='en', target='kn')
    
    def translate_kannada_to_english(self, text):
        """
        Translate Kannada text to English.
        
        Args:
            text (str): Kannada text to translate
            
        Returns:
            str: Translated English text, or original text if translation fails
        """
        if not text or not text.strip():
            return ""
        
        try:
            result = self.kannada_to_english.translate(text)
            logger.info(f"Translated: {text[:50]} -> {result[:50]}")
            return result
        except Exception as e:
            logger.error(f"Translation error (Kannada->English): {str(e)}")
            return text  # Return original if translation fails
    
    def translate_english_to_kannada(self, text):
        """
        Translate English text to Kannada.
        
        Args:
            text (str): English text to translate
            
        Returns:
            str: Translated Kannada text, or original text if translation fails
        """
        if not text or not text.strip():
            return ""
        
        try:
            result = self.english_to_kannada.translate(text)
            logger.info(f"Translated: {text[:50]} -> {result[:50]}")
            return result
        except Exception as e:
            logger.error(f"Translation error (English->Kannada): {str(e)}")
            return text  # Return original if translation fails
    
    def translate_error_to_kannada(self, error_message):
        """
        Translate error message to Kannada for user-friendly display.
        
        Args:
            error_message (str): Error message in English
            
        Returns:
            dict: Contains both English and Kannada error messages
        """
        try:
            kannada_error = self.translate_english_to_kannada(error_message)
            return {
                'error': error_message,
                'error_kannada': kannada_error
            }
        except Exception as e:
            logger.error(f"Error translation failed: {str(e)}")
            return {
                'error': error_message,
                'error_kannada': error_message
            }

# Global translator instance
translator = KannadaTranslator()
