from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views_auth import (
    RegisterView, LoginView, LogoutView, UserProfileView,
    CodeTaskViewSet, QuizQuestionViewSet, QuizAttemptViewSet,
    LearningAnalyticsView, RecommendationViewSet, LearningSessionViewSet,
    HealthCheckView, send_otp_view, verify_otp_register, PublicQuizQuestionViewSet
)
from .views_files import FileStorageViewSet, PublicFilesViewSet

router = DefaultRouter()
router.register(r'code-tasks', CodeTaskViewSet, basename='code-task')
router.register(r'quiz-questions', QuizQuestionViewSet, basename='quiz-question')
router.register(r'quiz-attempts', QuizAttemptViewSet, basename='quiz-attempt')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')
router.register(r'learning-sessions', LearningSessionViewSet, basename='learning-session')
router.register(r'files', FileStorageViewSet, basename='files')
router.register(r'public/quiz-questions', PublicQuizQuestionViewSet, basename='public-quiz-question')
router.register(r'public/materials', PublicFilesViewSet, basename='public-materials')

urlpatterns = [
    # Authentication
    path('auth/send-otp/', send_otp_view, name='send-otp'),
    path('auth/verify-otp/', verify_otp_register, name='verify-otp'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    
    # Analytics
    path('analytics/', LearningAnalyticsView.as_view(), name='analytics'),
    
    # Health
    path('health/', HealthCheckView.as_view(), name='health'),
    
    # Original endpoints (keep for backward compatibility)
    path('translate/kannada/', views.translate_kannada, name='translate_kannada'),
    path('execute/code/', views.execute_code, name='execute_code'),
    path('pipeline/full/', views.full_pipeline, name='full_pipeline'),
    path('trinket/embed/', views.generate_trinket_embed, name='generate_trinket_embed'),
    path('preprocess/', views.preprocess_text, name='preprocess_text'),
    
    # Router URLs
    path('', include(router.urls)),
]

