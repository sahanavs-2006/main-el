from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from nlp_model.seed_quiz_questions import seed_quiz_questions
from nlp_model.mongo_client import get_quiz_collection

@api_view(['GET'])
@permission_classes([AllowAny])
def seed_quiz_view(request):
    """
    Endpoint to trigger seeding of quiz questions.
    Useful for deployments where shell access is limited.
    """
    try:
        # Check if we already have questions
        col = get_quiz_collection()
        count = col.count_documents({})
        
        if count > 0:
            return Response({
                "status": "skipped", 
                "message": f"Database already has {count} questions. Seeding skipped to prevent duplicates."
            })
            
        # Run the seeder
        seed_quiz_questions()
        
        # Verify
        new_count = col.count_documents({})
        return Response({
            "status": "success", 
            "message": f"Successfully seeded {new_count} questions into the database."
        })
        
    except Exception as e:
        return Response({
            "status": "error", 
            "message": f"Seeding failed: {str(e)}"
        }, status=500)
