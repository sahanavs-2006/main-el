from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/execute/$', consumers.CodeExecutionConsumer.as_asgi(), name='execute-ws'),
]
