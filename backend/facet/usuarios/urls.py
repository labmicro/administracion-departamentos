from django.urls import path
from .views.apis import UserViewSet, GroupViewSet, MyTokenObtainPairView
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import *

# router permite registrar las vistas ViewSet
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
#router = routers.DefaultRouter(trailing_slash=False)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Manejar el restablecimiento de contraseña
    path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/validate/<str:uidb64>/<str:token>/', PasswordResetValidateView.as_view(), name='password_reset_validate'),
    path('password/reset/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # Cambiar clave si es la primera vez o bien si pasaron mas de 30 sin cambiar la clave   
    path('cambiar-clave/', CambiarClaveView.as_view(), name='cambiar_clave'),
    path('recaptcha/',ValidateRecaptchaView.as_view(),name='validate_recaptcha'),
]