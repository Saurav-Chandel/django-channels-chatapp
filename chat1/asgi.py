"""
ASGI config for chat1 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django
from channels.http import AsgiHandler
from core import routing
from channels.routing import ProtocolTypeRouter,URLRouter
from django.core.asgi import get_asgi_application
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat1.settings')

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket":AuthMiddlewareStack(
    URLRouter(routing.websocket_urlpatterns))
})
