import os
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

django_allowed_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")

# Convierte la cadena en una lista separada por comas
ALLOWED_HOSTS = django_allowed_hosts.split(',')

CORS_ALLOW_ALL_ORIGINS = True

# CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "origin",
    "dnt",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]

SWAGGER_SETTINGS = {
    "DOC_EXPANSION": "none",
    'SHOW_REQUEST_HEADERS': True,
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    'USE_SESSION_AUTH': False,
}

CORS_ALLOW_ALL_ORIGINS = False  # Desactiva el wildcard "*"
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React en local
    "http://127.0.0.1:3000",  # Alternativa
]
CORS_ALLOW_CREDENTIALS = True  # Permite envío de cookies
