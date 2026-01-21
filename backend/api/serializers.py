from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import (
    UserProfile, CodeTask, QuizQuestion, QuizOption, 
    QuizAttempt, LearningSession, LearningAnalytics, Recommendation
)

# ============ User & Authentication ============
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'user', 'kannada_proficiency', 'preferred_language',
            'total_codes_written', 'total_quizzes_attempted',
            'total_quizzes_passed', 'average_score', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        UserProfile.objects.create(user=user)
        return user


# ============ Code Task ============
class CodeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeTask
        fields = [
            'id', 'kannada_input', 'english_translation', 'generated_python_code',
            'code_output', 'error_message', 'error_kannada', 'execution_time',
            'is_valid', 'use_trinket', 'trinket_embed_url', 'trinket_iframe_html',
            'status', 'created_at', 'updated_at', 'last_executed'
        ]
        read_only_fields = ['id', 'english_translation', 'code_output', 'error_kannada', 'created_at', 'updated_at']


class CodeTaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeTask
        fields = ['id', 'kannada_input', 'status', 'created_at', 'generated_python_code']


# ============ Quiz ============
class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'option_text_kannada', 'option_text_english', 'is_correct', 
                  'explanation_kannada', 'explanation_english', 'order']


class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_kannada', 'question_english', 'difficulty', 
                  'category', 'options', 'created_at']


class QuizAttemptSerializer(serializers.ModelSerializer):
    question = QuizQuestionSerializer(read_only=True)
    selected_option = QuizOptionSerializer(read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'question', 'selected_option', 'is_correct', 'time_taken', 'attempted_at']


class QuizAttemptCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ['question', 'selected_option', 'time_taken']


# ============ Learning & Analytics ============
class LearningSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningSession
        fields = [
            'id', 'category', 'started_at', 'ended_at', 'codes_written',
            'quizzes_attempted', 'quizzes_correct', 'session_score', 'notes'
        ]
        read_only_fields = ['id', 'started_at']


class LearningAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningAnalytics
        fields = [
            'total_session_time', 'total_codes_executed', 'successful_codes',
            'total_quiz_attempts', 'total_quiz_correct', 'quiz_accuracy',
            'strongest_category', 'weakest_category', 'days_active',
            'streak_days', 'last_active', 'last_updated'
        ]
        read_only_fields = fields


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = [
            'id', 'recommendation_type', 'category', 'recommendation_kannada',
            'recommendation_english', 'priority', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
