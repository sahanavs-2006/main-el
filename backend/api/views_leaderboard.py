"""
API endpoint for leaderboard functionality.
Shows top performers based on quiz scores.
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, F
from django.contrib.auth.models import User
from api.models import QuizAttempt, UserProfile

@api_view(['GET'])
def leaderboard_view(request):
    """
    Get leaderboard with top performers.
    Query params:
    - limit: number of top users to return (default 10)
    - category: filter by quiz category (optional)
    """
    limit = int(request.GET.get('limit', 10))
    category = request.GET.get('category', None)
    
    # Build base query
    query = QuizAttempt.objects.select_related('user', 'question')
    
    if category:
        query = query.filter(question__category=category)
    
    # Aggregate statistics per user
    leaderboard = (
        query.values('user__id', 'user__username')
        .annotate(
            total_attempts=Count('id'),
            correct_answers=Sum('is_correct'),
            accuracy=Avg('is_correct') * 100,
            total_score=Sum('is_correct')  # 1 point per correct answer
        )
        .filter(total_attempts__gt=0)  # Only users with attempts
        .order_by('-total_score', '-accuracy', 'user__username')
    )[:limit]
    
    # Format response
    rankings = []
    for rank, entry in enumerate(leaderboard, 1):
        user_profile = UserProfile.objects.filter(user_id=entry['user__id']).first()
        
        rankings.append({
            'rank': rank,
            'userId': entry['user__id'],
            'username': entry['user__username'],
            'totalScore': entry['total_score'] or 0,
            'totalAttempts': entry['total_attempts'],
            'correctAnswers': entry['correct_answers'] or 0,
            'accuracy': round(entry['accuracy'] or 0, 1),
            'level': user_profile.level if user_profile else 1,
            'totalPoints': user_profile.total_points if user_profile else 0
        })
    
    return Response({
        'leaderboard': rankings,
        'total_users': len(rankings),
        'category': category or 'all'
    })


@api_view(['GET'])
def user_rank_view(request):
    """Get current user's rank and stats"""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=401)
    
    user = request.user
    category = request.GET.get('category', None)
    
    # Get user's stats
    query = QuizAttempt.objects.filter(user=user)
    if category:
        query = query.filter(question__category=category)
    
    stats = query.aggregate(
        total_attempts=Count('id'),
        correct_answers=Sum('is_correct'),
        accuracy=Avg('is_correct') * 100,
        total_score=Sum('is_correct')
    )
    
    # Get user's rank
    all_users_query = QuizAttempt.objects.select_related('user')
    if category:
        all_users_query = all_users_query.filter(question__category=category)
    
    all_users_scores = (
        all_users_query.values('user__id')
        .annotate(total_score=Sum('is_correct'))
        .order_by('-total_score')
    )
    
    user_rank = None
    for rank, entry in enumerate(all_users_scores, 1):
        if entry['user__id'] == user.id:
            user_rank = rank
            break
    
    user_profile = UserProfile.objects.filter(user=user).first()
    
    return Response({
        'rank': user_rank or 0,
        'username': user.username,
        'totalScore': stats['total_score'] or 0,
        'totalAttempts': stats['total_attempts'] or 0,
        'correctAnswers': stats['correct_answers'] or 0,
        'accuracy': round(stats['accuracy'] or 0, 1),
        'level': user_profile.level if user_profile else 1,
        'totalPoints': user_profile.total_points if user_profile else 0,
        'category': category or 'all'
    })
