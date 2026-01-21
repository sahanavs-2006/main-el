"""MongoDB client configuration and utilities"""
import os
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

# Read MongoDB connection string from environment or use local default
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'codenudi')

class MongoDBConnection:
    """Singleton for MongoDB connection"""
    _client = None
    _db = None

    @classmethod
    def get_client(cls):
        """Get or create MongoDB client"""
        if cls._client is None:
            try:
                cls._client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
                # Test the connection
                cls._client.admin.command('ping')
                print(f"✓ Connected to MongoDB: {MONGO_URI}")
            except (ServerSelectionTimeoutError, ConnectionFailure) as e:
                print(f"✗ Failed to connect to MongoDB: {e}")
                raise
        return cls._client

    @classmethod
    def get_database(cls):
        """Get MongoDB database instance"""
        if cls._db is None:
            client = cls.get_client()
            cls._db = client[MONGO_DB_NAME]
        return cls._db

    @classmethod
    def close(cls):
        """Close MongoDB connection"""
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None


# Collection helpers
def get_notes_collection():
    """Get notes collection"""
    db = MongoDBConnection.get_database()
    return db['notes']


def get_quiz_collection():
    """Get quiz questions collection"""
    db = MongoDBConnection.get_database()
    return db['quiz_questions']


def get_quiz_attempts_collection():
    """Get quiz attempts collection"""
    db = MongoDBConnection.get_database()
    return db['quiz_attempts']


def init_collections():
    """Initialize collections with indexes if needed"""
    db = MongoDBConnection.get_database()
    
    # Notes collection
    notes_col = db['notes']
    notes_col.create_index([('user_id', 1)])
    notes_col.create_index([('created_at', -1)])
    
    # Quiz questions collection
    quiz_col = db['quiz_questions']
    quiz_col.create_index([('category', 1)])
    quiz_col.create_index([('difficulty', 1)])
    
    # Quiz attempts collection
    attempts_col = db['quiz_attempts']
    attempts_col.create_index([('user_id', 1)])
    attempts_col.create_index([('attempted_at', -1)])
    
    print("✓ Collections initialized with indexes")
