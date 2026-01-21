from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
import logging
import json
import time

from translator.kannada_translator import translator
from nlp_model.codet5_generator import CodeT5Generator
from nlp_model.code_executor import executor
from nlp_model.trinket_io import trinket
from nlp_model.text_preprocessor import preprocessor
from django.conf import settings
from .validators import (
    KannadaTextValidator, 
    CodeExecutionValidator, 
    PipelineValidator,
    TrinketEmbedValidator
)

logger = logging.getLogger(__name__)

# Initialize generator with HuggingFace API
code_generator = CodeT5Generator(
    hf_token=settings.HF_TOKEN,
    hf_repo_id=settings.HF_REPO_ID
)

@api_view(['POST'])
@throttle_classes([AnonRateThrottle, UserRateThrottle])
def translate_kannada(request):
    """
    Translate Kannada text to English.
    Rate limit: 30 requests per minute per IP
    
    Request body:
    {
        "text": "Kannada text here"
    }
    """
    # Validate input
    validator = KannadaTextValidator(data=request.data)
    if not validator.is_valid():
        return Response(
            {
                'error': 'Invalid input',
                'error_kannada': 'ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್',
                'details': validator.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        start = time.time()
        text = validator.validated_data['text']
        logger.info(f"[translate_kannada] Incoming text: {text[:200]}")
        
        # Preprocess text
        preprocessing_result = preprocessor.preprocess(text)
        cleaned_text = preprocessing_result['cleaned_text']
        
        # Validate
        validation = preprocessor.validate_input(cleaned_text)
        if not validation['is_valid']:
            return Response({
                'error': validation['message'],
                'error_kannada': validation['message_kannada'],
                'original_text': text,
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        english_text = translator.translate_kannada_to_english(cleaned_text)
        
        resp = {
            'original_text': text,
            'kannada': cleaned_text,
            'english': english_text,
            'preprocessing_applied': preprocessing_result['changed'],
            'status': 'success'
        }
        logger.info(f"[translate_kannada] Completed in {time.time()-start:.3f}s")
        return Response(resp)
    
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@throttle_classes([AnonRateThrottle, UserRateThrottle])
def execute_code(request):
    """
    Execute Python code safely.
    Rate limit: 15 requests per minute per IP
    
    Request body:
    {
        "code": "Python code here",
        "inputs": ["input1", "input2"]
    }
    """
    # Validate input
    validator = CodeExecutionValidator(data=request.data)
    if not validator.is_valid():
        return Response(
            {
                'error': 'Invalid input',
                'error_kannada': 'ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್',
                'details': validator.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        start = time.time()
        code = validator.validated_data['code']
        inputs = validator.validated_data.get('inputs', [])
        logger.info(f"[execute_code] Code length: {len(code)}")
        
        if not code:
            return Response(
                {'error': 'No code provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prefer Judge0 if configured
        if executor.has_judge0():
            judge_result = executor.execute_via_judge0(code, inputs)
            if judge_result.get('status') != 'unavailable':
                result = judge_result
            else:
                logger.warning("Judge0 unavailable, falling back to local executor")
                result = executor.execute_code(code, inputs)
        else:
            result = executor.execute_code(code, inputs)
        
        resp = {
            'code': code,
            'status': result['status'],
            'output': result['output'],
            'error': result['error'],
            'execution_time': result['execution_time']
        }
        logger.info(f"[execute_code] Completed in {time.time()-start:.3f}s, status={result['status']}")
        return Response(resp)
    
    except Exception as e:
        logger.error(f"Execution error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@throttle_classes([AnonRateThrottle, UserRateThrottle])
def full_pipeline(request):
    """
    Complete pipeline: Kannada -> English -> Code Generation -> Execution
    Rate limit: 10 requests per minute per IP (most resource intensive)
    
    Request body:
    {
        "kannada_description": "ಕನ್ನಡ ಪರಿಕಲ್ಪನೆ",
        "use_trinket": true,
        "inputs": []
    }
    """
    # Validate input
    validator = PipelineValidator(data=request.data)
    if not validator.is_valid():
        return Response(
            {
                'error': 'Invalid input',
                'error_kannada': 'ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್',
                'details': validator.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        start = time.time()
        kannada_text = validator.validated_data['kannada_description']
        use_trinket = validator.validated_data.get('use_trinket', True)
        inputs = validator.validated_data.get('inputs', [])
        logger.info(f"[full_pipeline] Start, use_trinket={use_trinket}, text={kannada_text[:200]}")
        
        # Step 0: Preprocess and validate input text
        preprocessing_result = preprocessor.preprocess(kannada_text)
        cleaned_text = preprocessing_result['cleaned_text']
        
        # Validate preprocessed text
        validation = preprocessor.validate_input(cleaned_text)
        if not validation['is_valid']:
            return Response({
                'error': validation['message'],
                'error_kannada': validation['message_kannada'],
                'original_text': kannada_text,
                'preprocessing_info': preprocessing_result['preprocessing_info'],
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Use cleaned text for processing
        kannada_text = cleaned_text
        

        # --- Step 1: Translate Kannada to English using GoogleTranslator ---
        try:
            english_description = translator.translate_kannada_to_english(kannada_text)
            if not english_description or english_description.strip() == '':
                raise ValueError("Translation returned empty result")
        except Exception as e:
            error_msg = f"Translation error: {str(e)}"
            error_kannada_info = translator.translate_error_to_kannada(error_msg)
            return Response({
                'kannada_description': kannada_text,
                'original_text': preprocessing_result['original_text'],
                'error': error_kannada_info.get('error', error_msg),
                'error_kannada': error_kannada_info.get('error_kannada', 'ಅನುವಾದ ದೋಷ: ಕನ್ನಡದಿಂದ ಇಂಗ್ಲಿಷ್‌ಗೆ ಅನುವಾದಿಸಲು ವಿಫಲವಾಗಿದೆ'),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- Step 2: Generate code using Hugging Face Model (CodeT5) ---
        try:
            generation_result = code_generator.generate_code(english_description)
            generated_code = generation_result.get('code', '')
            if not generated_code:
                raise ValueError(generation_result.get('error', 'Code generation failed'))
        except Exception as e:
            error_msg = f"Code generation error: {str(e)}"
            error_kannada_info = translator.translate_error_to_kannada(error_msg)
            return Response({
                'kannada_description': kannada_text,
                'english_description': english_description,
                'error': error_kannada_info.get('error', error_msg),
                'error_kannada': error_kannada_info.get('error_kannada', 'ಕೋಡ್ ಉತ್ಪಾದನೆ ದೋಷ'),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_data = {
            'kannada_description': kannada_text,
            'english_description': english_description,
            'generated_code': generated_code,
        }
        
        # Check if code requires user input
        requires_input = 'input(' in generated_code
        user_inputs = inputs
        
        # Step 3: Prepare execution environment
        if use_trinket and not requires_input:
            # First validate syntax
            try:
                compile(generated_code, '<string>', 'exec')
            except SyntaxError as e:
                error_msg = f"Syntax Error: {str(e)}"
                error_kannada_info = translator.translate_error_to_kannada(error_msg)
                response_data.update({
                    'error': error_kannada_info.get('error', error_msg),
                    'error_kannada': error_kannada_info.get('error_kannada', error_msg),
                    'execution_environment': 'local',
                    'status': 'error'
                })
                return Response(response_data)
            
            # Then test runtime execution to catch runtime errors
            exec_env = 'local'
            execution_result = executor.execute_via_judge0(generated_code, user_inputs) if executor.has_judge0() else executor.execute_code(generated_code, user_inputs)
            if execution_result.get('status') == 'unavailable':
                exec_env = 'local'
                execution_result = executor.execute_code(generated_code, user_inputs)
            else:
                exec_env = 'judge0' if executor.has_judge0() else 'local'
            
            if execution_result['status'] == 'error' and execution_result['error']:
                # Runtime error detected - translate to Kannada
                error_kannada_info = translator.translate_error_to_kannada(execution_result['error'])
                response_data.update({
                    'error': error_kannada_info.get('error', execution_result['error']),
                    'error_kannada': error_kannada_info.get('error_kannada', execution_result['error']),
                    'execution_output': execution_result['output'],
                    'execution_environment': exec_env,
                    'status': 'error',
                    'note': 'Runtime error detected during validation'
                })
            else:
                # No errors - create Python Tutor embed (for visualization only)
                try:
                    trinket_result = trinket.generate_embed_url(generated_code)
                    response_data.update({
                        'trinket_embed_url': trinket_result.get('embed_url', ''),
                        'trinket_iframe_html': trinket_result.get('iframe_html', ''),
                        'execution_environment': 'python_tutor',
                        'validation_output': execution_result['output'],  # Show test run output
                        'status': 'success',
                        'note': 'Python Tutor visualization - for learning only'
                    })
                except Exception as e:
                    error_msg = f"Error creating embed: {str(e)}"
                    error_kannada_info = translator.translate_error_to_kannada(error_msg)
                    response_data.update({
                        'error': error_kannada_info.get('error', error_msg),
                        'error_kannada': error_kannada_info.get('error_kannada', error_msg),
                        'execution_environment': exec_env,
                        'status': 'error'
                    })
        else:
            # Use executor (Judge0 if available)
            exec_env = 'local'
            execution_result = executor.execute_via_judge0(generated_code, user_inputs) if executor.has_judge0() else executor.execute_code(generated_code, user_inputs)
            if execution_result.get('status') == 'unavailable':
                exec_env = 'local'
                execution_result = executor.execute_code(generated_code, user_inputs)
            else:
                exec_env = 'judge0' if executor.has_judge0() else 'local'
            
            # If there's an error, translate it to Kannada
            error_response = {}
            if execution_result['error']:
                error_kannada_info = translator.translate_error_to_kannada(execution_result['error'])
                error_response = error_kannada_info
            
            response_data.update({
                'execution_status': execution_result['status'],
                'output': execution_result['output'],
                'execution_time': execution_result['execution_time'],
                'error': error_response.get('error', ''),
                'error_kannada': error_response.get('error_kannada', ''),
                'execution_environment': exec_env,
                'status': 'success' if execution_result['status'] == 'success' else 'error'
            })
        
        logger.info(f"[full_pipeline] Completed in {time.time()-start:.3f}s, status={response_data.get('status')}")
        return Response(response_data)
    
    except Exception as e:
        logger.error(f"Pipeline error: {str(e)}")
        error_kannada_info = translator.translate_error_to_kannada(str(e))
        return Response({
            'error': str(e),
            'error_kannada': error_kannada_info.get('error_kannada', str(e)),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@throttle_classes([AnonRateThrottle, UserRateThrottle])
def generate_trinket_embed(request):
    """
    Generate Trinket IO embed for given code
    Rate limit: 20 requests per minute per IP
    
    Request body:
    {
        "code": "Python code to embed"
    }
    """
    # Validate input
    validator = TrinketEmbedValidator(data=request.data)
    if not validator.is_valid():
        return Response(
            {
                'error': 'Invalid input',
                'error_kannada': 'ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್',
                'details': validator.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        code = validator.validated_data['code']
        
        # Validate code syntax
        try:
            compile(code, '<string>', 'exec')
        except SyntaxError as e:
            error_msg = f"Syntax Error: {str(e)}"
            error_kannada_info = translator.translate_error_to_kannada(error_msg)
            return Response({
                'error': error_kannada_info.get('error', error_msg),
                'error_kannada': error_kannada_info.get('error_kannada', error_msg),
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        trinket_result = trinket.generate_embed_url(code)
        
        return Response({
            'embed_url': trinket_result.get('embed_url', ''),
            'iframe_html': trinket_result.get('iframe_html', ''),
            'status': 'success'
        })
    
    except Exception as e:
        logger.error(f"Trinket embed generation error: {str(e)}")
        error_kannada_info = translator.translate_error_to_kannada(str(e))
        return Response({
            'error': str(e),
            'error_kannada': error_kannada_info.get('error_kannada', str(e)),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def preprocess_text(request):
    """
    Preprocess and validate text input
    
    Request body:
    {
        "text": "Raw text input"
    }
    """
    try:
        text = request.data.get('text', '')
        
        if not text:
            return Response(
                {'error': 'No text provided', 'error_kannada': 'ಯಾವುದೇ ಪಠ್ಯ ಒದಗಿಸಲಾಗಿಲ್ಲ'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Preprocess text
        preprocessing_result = preprocessor.preprocess(text)
        
        # Validate
        validation = preprocessor.validate_input(preprocessing_result['cleaned_text'])
        
        # Get stats
        stats = preprocessor.get_text_stats(preprocessing_result['cleaned_text'])
        
        return Response({
            'original_text': preprocessing_result['original_text'],
            'cleaned_text': preprocessing_result['cleaned_text'],
            'changed': preprocessing_result['changed'],
            'preprocessing_info': preprocessing_result['preprocessing_info'],
            'validation': validation,
            'stats': stats,
            'status': 'success'
        })
    
    except Exception as e:
        logger.error(f"Text preprocessing error: {str(e)}")
        return Response({
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def health_check(request):
    """Health check endpoint."""
    return Response({
        'status': 'healthy',
        'message': 'Backend is running'
    })
