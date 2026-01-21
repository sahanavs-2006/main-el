"""
Input validation and sanitization utilities
"""
from rest_framework import serializers
import re


class KannadaTextValidator(serializers.Serializer):
    """Validator for Kannada text input"""
    text = serializers.CharField(
        max_length=5000,
        min_length=1,
        required=True,
        trim_whitespace=True,
        help_text="Kannada text to translate"
    )

    def validate_text(self, value):
        """Validate and sanitize text input"""
        # Remove potentially harmful characters
        sanitized = re.sub(r'[<>{}\\]', '', value)
        
        # Check for minimum meaningful length
        if len(sanitized.strip()) < 1:
            raise serializers.ValidationError("Text cannot be empty after sanitization")
        
        # Check for excessive special characters (potential injection)
        special_char_count = len(re.findall(r'[^\w\s\u0C80-\u0CFF]', sanitized))
        if special_char_count > len(sanitized) * 0.3:  # More than 30% special chars
            raise serializers.ValidationError("Text contains too many special characters")
        
        return sanitized


class CodeExecutionValidator(serializers.Serializer):
    """Validator for code execution input"""
    code = serializers.CharField(
        max_length=10000,
        min_length=1,
        required=True,
        trim_whitespace=True,
        help_text="Python code to execute"
    )
    inputs = serializers.ListField(
        child=serializers.CharField(max_length=1000),
        required=False,
        default=list,
        max_length=100,  # Max 100 input values
        help_text="Input values for the code"
    )

    def validate_code(self, value):
        """Validate Python code"""
        # Remove null bytes and other dangerous characters
        sanitized = value.replace('\x00', '')
        
        # Basic length check
        if len(sanitized.strip()) < 1:
            raise serializers.ValidationError("Code cannot be empty")
        
        # Check for dangerous imports/operations (basic safety)
        dangerous_patterns = [
            r'__import__',
            r'eval\s*\(',
            r'exec\s*\(',
            r'compile\s*\(',
            r'open\s*\(',
            r'file\s*\(',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, sanitized, re.IGNORECASE):
                raise serializers.ValidationError(
                    f"Code contains potentially dangerous operation: {pattern}"
                )
        
        return sanitized

    def validate_inputs(self, value):
        """Validate input list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Inputs must be a list")
        
        # Sanitize each input
        sanitized_inputs = []
        for inp in value:
            # Remove null bytes and limit length
            sanitized = str(inp).replace('\x00', '')[:1000]
            sanitized_inputs.append(sanitized)
        
        return sanitized_inputs


class PipelineValidator(serializers.Serializer):
    """Validator for full pipeline input"""
    kannada_description = serializers.CharField(
        max_length=5000,
        min_length=1,
        required=True,
        trim_whitespace=True,
        help_text="Kannada description of algorithm"
    )
    use_trinket = serializers.BooleanField(
        required=False,
        default=True,
        help_text="Whether to use Trinket IO for execution"
    )
    inputs = serializers.ListField(
        child=serializers.CharField(max_length=1000),
        required=False,
        default=list,
        max_length=100,
        help_text="Input values for code execution"
    )

    def validate_kannada_description(self, value):
        """Validate Kannada description"""
        # Sanitize
        sanitized = re.sub(r'[<>{}\\]', '', value)
        
        if len(sanitized.strip()) < 1:
            raise serializers.ValidationError("Description cannot be empty")
        
        # Check for excessive special characters
        special_char_count = len(re.findall(r'[^\w\s\u0C80-\u0CFF]', sanitized))
        if special_char_count > len(sanitized) * 0.3:
            raise serializers.ValidationError("Description contains too many special characters")
        
        return sanitized

    def validate_inputs(self, value):
        """Validate inputs"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Inputs must be a list")
        
        sanitized_inputs = []
        for inp in value:
            sanitized = str(inp).replace('\x00', '')[:1000]
            sanitized_inputs.append(sanitized)
        
        return sanitized_inputs


class TrinketEmbedValidator(serializers.Serializer):
    """Validator for Trinket embed generation"""
    code = serializers.CharField(
        max_length=10000,
        min_length=1,
        required=True,
        trim_whitespace=True,
        help_text="Python code for Trinket embed"
    )

    def validate_code(self, value):
        """Validate code for Trinket"""
        sanitized = value.replace('\x00', '')
        
        if len(sanitized.strip()) < 1:
            raise serializers.ValidationError("Code cannot be empty")
        
        return sanitized
