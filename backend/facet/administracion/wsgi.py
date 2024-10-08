"""
WSGI config for facet project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

# Asegúrate de que este apunte al archivo de configuración correcto
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'administracion.settings.produccion')  # Ajusta esto según tu estructura

application = get_wsgi_application()
