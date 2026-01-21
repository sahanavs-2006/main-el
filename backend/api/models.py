from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
import random
from datetime import timedelta

class UserProfile(models.Model):
    """Extended user profile with learning preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    phone_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    kannada_proficiency = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ],
        default='beginner'
    )
    preferred_language = models.CharField(
        max_length=10,
        choices=[('kn', 'Kannada'), ('en', 'English')],
        default='kn'
    )
    total_codes_written = models.IntegerField(default=0)
    total_quizzes_attempted = models.IntegerField(default=0)
    total_quizzes_passed = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def generate_otp(self):
        """Generate 6-digit OTP"""
        self.otp = str(random.randint(100000, 999999))
        self.otp_created_at = timezone.now()
        self.save()
        return self.otp

    def verify_otp(self, otp):
        """Verify OTP and check if it's within 10 minutes"""
        if not self.otp or not self.otp_created_at:
            return False
        
        # Check if OTP is expired (10 minutes)
        if timezone.now() > self.otp_created_at + timedelta(minutes=10):
            return False
        
        if self.otp == otp:
            self.phone_verified = True
            self.otp = None
            self.otp_created_at = None
            self.save()
            return True
        return False

    def __str__(self):
        return f"{self.user.username}'s Profile"


class CodeTask(models.Model):
    """Store Kannada algorithm input and generated Python code"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='code_tasks')
    kannada_input = models.TextField(help_text="Algorithm description in Kannada")
    english_translation = models.TextField(blank=True, help_text="Auto-translated English version")
    generated_python_code = models.TextField(blank=True)
    code_output = models.TextField(blank=True, null=True, help_text="Program output or None if not executed")
    error_message = models.TextField(blank=True, null=True, help_text="Error message if execution failed")
    error_kannada = models.TextField(blank=True, null=True, help_text="Error translated to Kannada")
    execution_time = models.FloatField(null=True, blank=True, help_text="Execution time in seconds")
    is_valid = models.BooleanField(default=False, help_text="Whether code is syntactically valid")
    use_trinket = models.BooleanField(default=False, help_text="Whether to use Trinket IO for execution")
    trinket_embed_url = models.URLField(blank=True, null=True)
    trinket_iframe_html = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),
            ('success', 'Success'),
            ('error', 'Error'),
            ('pending', 'Pending'),
        ],
        default='draft'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_executed = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.kannada_input[:50]}..."


class QuizQuestion(models.Model):
    """Quiz questions in Kannada for learning assessment"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question_kannada = models.TextField(help_text="Question in Kannada")
    question_english = models.TextField(blank=True, help_text="English translation (optional)")
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', 'Easy'),
            ('medium', 'Medium'),
            ('hard', 'Hard'),
        ],
        default='medium'
    )
    category = models.CharField(
        max_length=50,
        choices=[
            ('basic_syntax', 'Basic Syntax'),
            ('loops', 'Loops'),
            ('conditionals', 'Conditionals'),
            ('functions', 'Functions'),
            ('data_structures', 'Data Structures'),
            ('algorithms', 'Algorithms'),
        ],
        default='basic_syntax'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'difficulty']

    def __str__(self):
        return f"Q: {self.question_kannada[:50]}..."


class QuizOption(models.Model):
    """Multiple choice options for quiz questions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='options')
    option_text_kannada = models.TextField()
    option_text_english = models.TextField(blank=True)
    is_correct = models.BooleanField(default=False)
    explanation_kannada = models.TextField(blank=True, help_text="Why this is/isn't correct in Kannada")
    explanation_english = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.question.question_kannada[:30]}... -> {self.option_text_kannada[:30]}..."


class QuizAttempt(models.Model):
    """Track user quiz attempts and responses"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='attempts')
    selected_option = models.ForeignKey(QuizOption, on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    time_taken = models.IntegerField(null=True, blank=True, help_text="Time taken in seconds")
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-attempted_at']
        unique_together = ('user', 'question', 'attempted_at')

    def __str__(self):
        return f"{self.user.username} - Q: {self.question.question_kannada[:30]}... - {'✓' if self.is_correct else '✗'}"


class LearningSession(models.Model):
    """Track user learning sessions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='learning_sessions')
    category = models.CharField(
        max_length=50,
        choices=[
            ('coding', 'Coding'),
            ('quiz', 'Quiz'),
            ('practice', 'Practice'),
        ],
        default='coding'
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    codes_written = models.IntegerField(default=0)
    quizzes_attempted = models.IntegerField(default=0)
    quizzes_correct = models.IntegerField(default=0)
    session_score = models.FloatField(default=0.0)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} - {self.category} - {self.started_at.date()}"


class LearningAnalytics(models.Model):
    """Aggregated analytics for personalized recommendations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='analytics')
    total_session_time = models.IntegerField(default=0, help_text="Total time in minutes")
    total_codes_executed = models.IntegerField(default=0)
    successful_codes = models.IntegerField(default=0)
    total_quiz_attempts = models.IntegerField(default=0)
    total_quiz_correct = models.IntegerField(default=0)
    quiz_accuracy = models.FloatField(default=0.0, help_text="Percentage accuracy")
    strongest_category = models.CharField(max_length=50, blank=True)
    weakest_category = models.CharField(max_length=50, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    # Engagement metrics
    days_active = models.IntegerField(default=0)
    streak_days = models.IntegerField(default=0, help_text="Current consecutive days active")
    last_active = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Analytics - {self.user.username}"


class Recommendation(models.Model):
    """Personalized learning recommendations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    recommendation_type = models.CharField(
        max_length=50,
        choices=[
            ('weak_area', 'Weak Area - Study This'),
            ('next_level', 'Next Level Challenge'),
            ('review', 'Review Previous Topic'),
            ('practice_more', 'Practice More on Topic'),
        ],
        default='weak_area'
    )
    category = models.CharField(max_length=50)
    recommendation_kannada = models.TextField()
    recommendation_english = models.TextField(blank=True)
    priority = models.IntegerField(default=0, help_text="1-10, higher = more important")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-priority', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.recommendation_type}: {self.category}"
