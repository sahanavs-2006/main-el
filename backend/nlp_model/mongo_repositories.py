"""MongoDB repositories for data access layer"""
from datetime import datetime, timezone
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError
from nlp_model.mongo_client import (
    get_notes_collection,
    get_quiz_collection,
    get_quiz_attempts_collection
)


class NotesRepository:
    """Handle all notes operations in MongoDB"""
    
    @staticmethod
    def create_note(user_id, title, content, language='kannada', tags=None):
        """Create a new note"""
        try:
            notes_col = get_notes_collection()
            note = {
                'user_id': user_id,
                'title': title,
                'content': content,
                'language': language,
                'tags': tags or [],
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'is_deleted': False
            }
            result = notes_col.insert_one(note)
            note['_id'] = result.inserted_id
            return note
        except PyMongoError as e:
            raise Exception(f"Failed to create note: {e}")
    
    @staticmethod
    def get_note(note_id, user_id):
        """Get a single note by ID"""
        try:
            notes_col = get_notes_collection()
            note = notes_col.find_one({
                '_id': ObjectId(note_id),
                'user_id': user_id,
                'is_deleted': False
            })
            return note
        except PyMongoError as e:
            raise Exception(f"Failed to get note: {e}")
    
    @staticmethod
    def get_user_notes(user_id, limit=100, skip=0):
        """Get all notes for a user with pagination"""
        try:
            notes_col = get_notes_collection()
            notes = list(notes_col.find({
                'user_id': user_id,
                'is_deleted': False
            }).sort('created_at', -1).skip(skip).limit(limit))
            return notes
        except PyMongoError as e:
            raise Exception(f"Failed to get user notes: {e}")
    
    @staticmethod
    def update_note(note_id, user_id, title=None, content=None, tags=None):
        """Update an existing note"""
        try:
            notes_col = get_notes_collection()
            update_data = {'updated_at': datetime.now(timezone.utc)}
            
            if title is not None:
                update_data['title'] = title
            if content is not None:
                update_data['content'] = content
            if tags is not None:
                update_data['tags'] = tags
            
            result = notes_col.update_one(
                {'_id': ObjectId(note_id), 'user_id': user_id, 'is_deleted': False},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            raise Exception(f"Failed to update note: {e}")
    
    @staticmethod
    def delete_note(note_id, user_id, soft_delete=True):
        """Delete a note (soft or hard delete)"""
        try:
            notes_col = get_notes_collection()
            
            if soft_delete:
                # Soft delete - mark as deleted
                result = notes_col.update_one(
                    {'_id': ObjectId(note_id), 'user_id': user_id},
                    {'$set': {'is_deleted': True, 'deleted_at': datetime.now(timezone.utc)}}
                )
            else:
                # Hard delete - permanently remove
                result = notes_col.delete_one({
                    '_id': ObjectId(note_id),
                    'user_id': user_id
                })
            
            return result.modified_count > 0 or result.deleted_count > 0
        except PyMongoError as e:
            raise Exception(f"Failed to delete note: {e}")
    
    @staticmethod
    def search_notes(user_id, query, limit=50):
        """Search notes by title or content"""
        try:
            notes_col = get_notes_collection()
            notes = list(notes_col.find({
                'user_id': user_id,
                'is_deleted': False,
                '$or': [
                    {'title': {'$regex': query, '$options': 'i'}},
                    {'content': {'$regex': query, '$options': 'i'}}
                ]
            }).limit(limit))
            return notes
        except PyMongoError as e:
            raise Exception(f"Failed to search notes: {e}")


class QuizRepository:
    """Handle all quiz operations in MongoDB"""
    
    @staticmethod
    def create_question(question_text, category, difficulty, options, explanation=None):
        """Create a new quiz question"""
        try:
            quiz_col = get_quiz_collection()
            question = {
                'question_text': question_text,
                'category': category,
                'difficulty': difficulty,
                'options': options,  # List of {'text': '', 'is_correct': bool, 'explanation_kannada': ''}
                'explanation': explanation,
                'created_at': datetime.now(timezone.utc),
                'is_active': True
            }
            result = quiz_col.insert_one(question)
            question['_id'] = result.inserted_id
            return question
        except PyMongoError as e:
            raise Exception(f"Failed to create quiz question: {e}")
    
    @staticmethod
    def get_question(question_id):
        """Get a single question"""
        try:
            quiz_col = get_quiz_collection()
            return quiz_col.find_one({
                '_id': ObjectId(question_id),
                'is_active': True
            })
        except PyMongoError as e:
            raise Exception(f"Failed to get question: {e}")
    
    @staticmethod
    def get_questions_by_category(category, difficulty=None, limit=10):
        """Get questions by category and optional difficulty"""
        try:
            quiz_col = get_quiz_collection()
            query = {'category': category, 'is_active': True}
            
            if difficulty:
                query['difficulty'] = difficulty
            
            questions = list(quiz_col.find(query).limit(limit))
            return questions
        except PyMongoError as e:
            raise Exception(f"Failed to get questions: {e}")
    
    @staticmethod
    def get_random_questions(difficulty=None, limit=5):
        """Get random questions"""
        try:
            quiz_col = get_quiz_collection()
            query = {'is_active': True}
            
            if difficulty:
                query['difficulty'] = difficulty
            
            questions = list(quiz_col.aggregate([
                {'$match': query},
                {'$sample': {'size': limit}}
            ]))
            return questions
        except PyMongoError as e:
            raise Exception(f"Failed to get random questions: {e}")
    
    @staticmethod
    def update_question(question_id, **kwargs):
        """Update question fields"""
        try:
            quiz_col = get_quiz_collection()
            update_data = kwargs
            update_data['updated_at'] = datetime.now(timezone.utc)
            
            result = quiz_col.update_one(
                {'_id': ObjectId(question_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            raise Exception(f"Failed to update question: {e}")


class QuizAttemptRepository:
    """Handle quiz attempt tracking"""
    
    @staticmethod
    def record_attempt(user_id, question_id, selected_option_id, is_correct, time_taken=None):
        """Record a quiz attempt"""
        try:
            attempts_col = get_quiz_attempts_collection()
            attempt = {
                'user_id': user_id,
                'question_id': ObjectId(question_id) if isinstance(question_id, str) else question_id,
                'selected_option_id': selected_option_id,
                'is_correct': is_correct,
                'time_taken': time_taken,  # in seconds
                'attempted_at': datetime.now(timezone.utc)
            }
            result = attempts_col.insert_one(attempt)
            attempt['_id'] = result.inserted_id
            return attempt
        except PyMongoError as e:
            raise Exception(f"Failed to record attempt: {e}")
    
    @staticmethod
    def get_user_attempts(user_id, limit=100, skip=0):
        """Get user's quiz attempts"""
        try:
            attempts_col = get_quiz_attempts_collection()
            attempts = list(attempts_col.find({
                'user_id': user_id
            }).sort('attempted_at', -1).skip(skip).limit(limit))
            return attempts
        except PyMongoError as e:
            raise Exception(f"Failed to get attempts: {e}")
    
    @staticmethod
    def get_user_stats(user_id):
        """Get user's quiz performance stats"""
        try:
            attempts_col = get_quiz_attempts_collection()
            
            total = attempts_col.count_documents({'user_id': user_id})
            correct = attempts_col.count_documents({'user_id': user_id, 'is_correct': True})
            
            accuracy = (correct / total * 100) if total > 0 else 0
            
            # Category-wise stats
            category_stats = list(attempts_col.aggregate([
                {'$match': {'user_id': user_id}},
                {'$group': {
                    '_id': '$question_id',
                    'count': {'$sum': 1},
                    'correct_count': {
                        '$sum': {'$cond': ['$is_correct', 1, 0]}
                    }
                }},
                {'$sort': {'attempted_at': -1}}
            ]))
            
            return {
                'total_attempts': total,
                'correct_answers': correct,
                'accuracy': accuracy,
                'category_stats': category_stats
            }
        except PyMongoError as e:
            raise Exception(f"Failed to get stats: {e}")
