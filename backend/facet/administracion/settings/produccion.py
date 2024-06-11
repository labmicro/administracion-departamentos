import os
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

django_allowed_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS")

# Convierte la cadena en una lista separada por comas
ALLOWED_HOSTS = django_allowed_hosts.split(",")

MIDDLEWARE += [
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ),
    "DEFAULT_PARSER_CLASSES": ("rest_framework.parsers.JSONParser","rest_framework.parsers.FormParser", "rest_framework.parsers.MultiPartParser"),  # Parser JSON
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",  # Renderizador JSON
        'rest_framework.renderers.BrowsableAPIRenderer',  # Comenta o elimina esta línea para deshabilitar el renderizador HTML
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 10,
    "DATETIME_FORMAT": "%d/%m/%Y %H:%M:%S",
    "DATE_FORMAT": "%d/%m/%Y",
}
CORS_ORIGIN_WHITELIST = [
    'http://agenciasdequiniela.cajapopular.gov.ar',
    'https://agenciasdequiniela.cajapopular.gov.ar',
    'http://juegoscpa.cajapop.org',
]
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_EXPOSE_HEADERS = [
    "content-type",
    "x-csrftoken",
]

CORS_ALLOW_CREDENTIALS = True
