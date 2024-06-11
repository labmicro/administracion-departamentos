from rest_framework import routers

from .apis import *


# router permite registrar las vistas ViewSet en urlpatterns
router = routers.DefaultRouter()
router.register(r'roles', RolViewSet)
