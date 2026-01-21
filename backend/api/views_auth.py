from rest_framework import status, viewsets, generics
import requests
import os
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone
from api.models import (
    UserProfile, CodeTask, QuizQuestion, QuizAttempt,
    LearningSession, LearningAnalytics, Recommendation
)
from api.serializers import (
    UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
    CodeTaskSerializer, CodeTaskListSerializer, QuizQuestionSerializer,
    QuizAttemptSerializer, QuizAttemptCreateSerializer, LearningSessionSerializer,
    LearningAnalyticsSerializer, RecommendationSerializer
)

def send_otp_sms(phone_number, otp):
    """Send OTP via SMS (Simulated for Dev)"""
    # Print for dev logging
    print(f"\n{'='*50}")
    print(f"OTP for {phone_number}: {otp}")
    print(f"{'='*50}\n")
    
    # Force success for Development
    return True, "Dev Mode (Simulated)"


# ============ Authentication Views ============
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_view(request):
    """Send OTP to phone number for registration"""
    phone_number = request.data.get('phone_number')
    username = request.data.get('username')
    
    if not phone_number or not username:
        return Response({
            'error': 'Phone number and username are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if phone number already exists
    if UserProfile.objects.filter(phone_number=phone_number, phone_verified=True).exists():
        return Response({
            'error': 'Phone number already registered'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response({
            'error': 'Username already taken'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create temporary user profile or get existing
    user, created = User.objects.get_or_create(
        username=f"temp_{phone_number}",
        defaults={'is_active': False}
    )
    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.phone_number = phone_number
    profile.save()
    
    # Generate and send OTP
    otp = profile.generate_otp()
    send_otp_sms(phone_number, otp)
    
    return Response({
        'message': 'OTP sent successfully (Dev Mode)',
        'phone_number': phone_number,
        'otp': otp
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_register(request):
    """Verify OTP and complete registration"""
    phone_number = request.data.get('phone_number')
    otp = request.data.get('otp')
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not all([phone_number, otp, username, password]):
        return Response({
            'error': 'All fields are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        profile = UserProfile.objects.get(phone_number=phone_number)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'Phone number not found. Please request OTP first.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Verify OTP
    if not profile.verify_otp(str(otp)):
        return Response({
            'error': 'Invalid or expired OTP'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete temporary user and create actual user
    temp_user = profile.user
    
    # Create new user
    user = User.objects.create_user(
        username=username,
        password=password
    )
    
    # Update profile to point to new user
    profile.user = user
    profile.save()
    
    # Delete temporary user
    if temp_user.username.startswith('temp_'):
        temp_user.delete()
    
    # Create token
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({
        'user': UserSerializer(user).data,
        'token': token.key,
        'message': 'Registration successful'
    }, status=status.HTTP_201_CREATED)


class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """User login endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'profile': UserProfileSerializer(user.profile).data
        }, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


# ============ Code Task Views ============
class CodeTaskViewSet(viewsets.ModelViewSet):
    """CRUD operations for code tasks"""
    serializer_class = CodeTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CodeTask.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Execute saved code task"""
        code_task = self.get_object()
        # Integration with your existing code executor
        # This is a placeholder for your execution logic
        return Response({
            'message': 'Code execution endpoint',
            'code_id': code_task.id
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def my_codes(self, request):
        """List all user's code tasks"""
        queryset = self.get_queryset().order_by('-created_at')
        serializer = CodeTaskListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Delete multiple code tasks"""
        ids = request.data.get('ids', [])
        CodeTask.objects.filter(user=request.user, id__in=ids).delete()
        return Response({
            'message': f'Deleted {len(ids)} code tasks'
        }, status=status.HTTP_200_OK)


# ============ Quiz Views ============
class QuizQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """Retrieve quiz questions"""
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['category', 'difficulty']

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get questions by category"""
        category = request.query_params.get('category')
        if not category:
            return Response({
                'error': 'Category parameter required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        questions = QuizQuestion.objects.filter(category=category)
        serializer = self.get_serializer(questions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def random_by_difficulty(self, request):
        """Get random questions by difficulty"""
        difficulty = request.query_params.get('difficulty', 'medium')
        limit = int(request.query_params.get('limit', 5))
        
        questions = QuizQuestion.objects.filter(
            difficulty=difficulty
        ).order_by('?')[:limit]
        
        serializer = self.get_serializer(questions, many=True)
        return Response(serializer.data)


class QuizAttemptViewSet(viewsets.ViewSet):
    """Quiz attempt tracking"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Get user's quiz attempts"""
        attempts = QuizAttempt.objects.filter(user=request.user).order_by('-attempted_at')
        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)

    def create(self, request):
        """Record a quiz attempt"""
        serializer = QuizAttemptCreateSerializer(data=request.data)
        if serializer.is_valid():
            selected_option = serializer.validated_data.get('selected_option')
            is_correct = selected_option.is_correct if selected_option else False
            
            attempt = QuizAttempt.objects.create(
                user=request.user,
                is_correct=is_correct,
                **serializer.validated_data
            )
            
            return Response({
                'id': attempt.id,
                'is_correct': is_correct,
                'explanation': selected_option.explanation_kannada if selected_option else ''
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def performance(self, request):
        """Get user quiz performance stats"""
        attempts = QuizAttempt.objects.filter(user=request.user)
        total = attempts.count()
        correct = attempts.filter(is_correct=True).count()
        
        return Response({
            'total_attempts': total,
            'correct_answers': correct,
            'accuracy': (correct / total * 100) if total > 0 else 0,
            'by_category': self._get_category_performance(attempts)
        })

    def _get_category_performance(self, attempts):
        """Helper to calculate performance by category"""
        categories = {}
        for attempt in attempts:
            cat = attempt.question.category
            if cat not in categories:
                categories[cat] = {'total': 0, 'correct': 0}
            categories[cat]['total'] += 1
            if attempt.is_correct:
                categories[cat]['correct'] += 1
        
        for cat in categories:
            total = categories[cat]['total']
            correct = categories[cat]['correct']
            categories[cat]['accuracy'] = (correct / total * 100) if total > 0 else 0
        
        return categories


# ============ Learning & Analytics Views ============
class LearningAnalyticsView(generics.RetrieveAPIView):
    """Get user's learning analytics"""
    serializer_class = LearningAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        analytics, _ = LearningAnalytics.objects.get_or_create(user=self.request.user)
        return analytics


class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """Get personalized learning recommendations"""
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recommendation.objects.filter(
            user=self.request.user,
            is_active=True
        ).order_by('-priority')

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active recommendations only"""
        recommendations = self.get_queryset()
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)


class LearningSessionViewSet(viewsets.ModelViewSet):
    """Track learning sessions"""
    serializer_class = LearningSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LearningSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        """End a learning session"""
        session = self.get_object()
        session.ended_at = timezone.now()
        session.save()
        return Response({
            'message': 'Session ended',
            'session': LearningSessionSerializer(session).data
        })


# ============ Health & Utils ============
class HealthCheckView(generics.GenericAPIView):
    """Health check endpoint"""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'status': 'healthy',
            'message': 'CodeNudi backend is running',
            'timestamp': timezone.now()
        }, status=status.HTTP_200_OK)


# ============ Public Read-Only Views ============
class PublicQuizQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """Public readonly access to quiz questions (no auth required)."""
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['category', 'difficulty']

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if not category:
            return Response({'error': 'Category parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        qs = QuizQuestion.objects.filter(category=category)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def random(self, request):
        limit = int(request.query_params.get('limit', 5))
        qs = QuizQuestion.objects.order_by('?')[:limit]
        return Response(self.get_serializer(qs, many=True).data)
