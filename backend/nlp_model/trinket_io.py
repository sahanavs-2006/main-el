import requests
import logging
from typing import Dict
import base64

logger = logging.getLogger(__name__)

class TrinketIO:
    """
    Python code embed integration using Python Tutor for visualization.
    """
    
    def __init__(self):
        """Initialize embed integration."""
        self.pythontutor_base = "https://pythontutor.com/iframe-embed.html"
    
    def generate_embed_url(self, code: str) -> Dict:
        """
        Generate Python Tutor embed URL for the given code.
        
        Args:
            code (str): Python code to embed
            
        Returns:
            dict: Contains embed URL and iframe HTML
        """
        try:
            import urllib.parse
            encoded_code = urllib.parse.quote(code)
            
            # Use Python Tutor for visualization
            embed_url = f"{self.pythontutor_base}#code={encoded_code}&origin=opt-frontend.js&cumulative=false&heapPrimitives=false&textReferences=false&py=3&rawInputLstJSON=%5B%5D&curInstr=0&codeDivWidth=50%25&codeDivHeight=100%25"
            
            # Generate iframe HTML
            iframe_html = f'''<iframe 
                src="{embed_url}" 
                width="100%" 
                height="600" 
                frameborder="0" 
                scrolling="no"
                allowfullscreen>
            </iframe>'''
            
            return {
                'embed_url': embed_url,
                'iframe_html': iframe_html,
                'status': 'success'
            }
        
        except Exception as e:
            logger.error(f"Embed generation error: {str(e)}")
            return {
                'error': str(e),
                'status': 'error'
            }
    
    def create_trinket(self, code: str, title: str = "Generated Code") -> Dict:
        """
        Create an embed for the code.
        
        Args:
            code (str): Python code
            title (str): Title for the code
            
        Returns:
            dict: Contains embed URL and HTML
        """
        return self.generate_embed_url(code)
    
    def get_shareable_link(self, code: str) -> str:
        """
        Generate a shareable embed link.
        
        Args:
            code (str): Python code
            
        Returns:
            str: Shareable embed URL
        """
        result = self.generate_embed_url(code)
        return result.get('embed_url', '')

# Global Trinket instance
trinket = TrinketIO()

