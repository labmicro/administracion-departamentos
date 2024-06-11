from .base import *

if ENVIRONMENT == 'P':
    print("Running in environment: PRODUCTION")
    from .produccion import *
else:
    if ENVIRONMENT == 'D':
        print("Running in environment: DEVELOPMENT")
        from .desarrollo import *
    else:
        print("Running in environment: LOCAL")
        from .local import *
    # INSTALLED_APPS += ['debug_toolbar']
    # MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']