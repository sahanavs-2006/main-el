"""
API views for accessing files stored in MongoDB
Handles PDF files, code files, and other documents
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from django.http import FileResponse, HttpResponse
from bson.objectid import ObjectId
from gridfs import GridFS
from datetime import datetime, timezone
import mimetypes

from nlp_model.mongo_client import MongoDBConnection


class FileStorageViewSet(viewsets.ViewSet):
    """
    API endpoints for managing files in MongoDB
    Supports upload, download, list, and delete operations
    """
    permission_classes = [IsAuthenticated]
    
    def get_fs(self):
        """Get GridFS instance"""
        db = MongoDBConnection.get_database()
        return GridFS(db)
    
    @action(detail=False, methods=['get'])
    def list_files(self, request):
        """List all files for current user"""
        try:
            db = MongoDBConnection.get_database()
            files_collection = db['fs.files']
            
            # Get files for current user
            user_id = str(request.user.id)
            files = list(files_collection.find({
                'metadata.user_id': user_id
            }).sort('uploadDate', -1))
            
            file_list = []
            for f in files:
                file_list.append({
                    'id': str(f.get('_id')),
                    'filename': f.get('filename'),
                    'size': f.get('length', 0),
                    'uploaded_at': f.get('uploadDate'),
                    'content_type': f.get('contentType', 'application/octet-stream')
                })
            
            return Response({
                'count': len(file_list),
                'files': file_list
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload a file to MongoDB"""
        try:
            if 'file' not in request.FILES:
                return Response({
                    'error': 'No file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            uploaded_file = request.FILES['file']
            user_id = str(request.user.id)
            
            fs = self.get_fs()
            
            file_id = fs.put(
                uploaded_file.read(),
                filename=uploaded_file.name,
                content_type=uploaded_file.content_type,
                metadata={
                    'user_id': user_id,
                    'original_name': uploaded_file.name,
                    'uploaded_at': datetime.now(timezone.utc)
                }
            )
            
            return Response({
                'id': str(file_id),
                'filename': uploaded_file.name,
                'size': uploaded_file.size,
                'message': 'File uploaded successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def download(self, request):
        """Download a file from MongoDB"""
        try:
            file_id = request.query_params.get('id')
            if not file_id:
                return Response({
                    'error': 'File ID required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            fs = self.get_fs()
            file_obj = fs.get(ObjectId(file_id))
            
            filename = file_obj.filename
            response = HttpResponse(
                file_obj.read(),
                content_type=file_obj.content_type or 'application/octet-stream'
            )
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def delete_file(self, request):
        """Delete a file from MongoDB"""
        try:
            file_id = request.query_params.get('id')
            if not file_id:
                return Response({
                    'error': 'File ID required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            fs = self.get_fs()
            fs.delete(ObjectId(file_id))
            
            return Response({
                'message': 'File deleted successfully'
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def get_file_info(self, request):
        """Get detailed info about a file"""
        try:
            file_id = request.query_params.get('id')
            if not file_id:
                return Response({
                    'error': 'File ID required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            db = MongoDBConnection.get_database()
            files_collection = db['fs.files']
            
            file_doc = files_collection.find_one({
                '_id': ObjectId(file_id)
            })
            
            if not file_doc:
                return Response({
                    'error': 'File not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'id': str(file_doc.get('_id')),
                'filename': file_doc.get('filename'),
                'size': file_doc.get('length'),
                'content_type': file_doc.get('contentType'),
                'uploaded_at': file_doc.get('uploadDate'),
                'metadata': file_doc.get('metadata', {})
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class PublicFilesViewSet(viewsets.ViewSet):
    """
    Public API for accessing study materials (no authentication required)
    """
    permission_classes = [AllowAny]
    
    def get_fs(self):
        """Get GridFS instance"""
        db = MongoDBConnection.get_database()
        return GridFS(db)
    
    @action(detail=False, methods=['get'])
    def study_materials(self, request):
        """Get all public study materials"""
        try:
            db = MongoDBConnection.get_database()
            files_collection = db['fs.files']
            
            # Get files marked as public or admin files
            # Check both top-level and nested metadata fields
            files = list(files_collection.find({
                '$or': [
                    {'user_id': 'admin'},
                    {'is_public': True},
                    {'metadata.user_id': 'admin'},
                    {'metadata.is_public': True}
                ]
            }).sort('uploadDate', -1))
            
            # If no files found with filters, get all PDF files
            if not files:
                files = list(files_collection.find({
                    'filename': {'$regex': '.pdf$', '$options': 'i'}
                }).sort('uploadDate', -1))
            
            materials = []
            for f in files:
                filename = f.get('filename', '')
                materials.append({
                    'id': str(f.get('_id')),
                    'filename': filename,
                    'category': filename.replace('.pdf', '').title(),
                    'size': f.get('length', 0),
                    'uploaded_at': f.get('uploadDate'),
                    'content_type': f.get('contentType', 'application/pdf')
                })
            
            return Response({
                'count': len(materials),
                'materials': materials
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def download_material(self, request):
        """Download a public study material"""
        try:
            file_id = request.query_params.get('id')
            if not file_id:
                return Response({
                    'error': 'File ID required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            fs = self.get_fs()
            file_obj = fs.get(ObjectId(file_id))
            
            filename = file_obj.filename
            response = HttpResponse(
                file_obj.read(),
                content_type=file_obj.content_type or 'application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
