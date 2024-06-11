from django.contrib import admin
from django.urls import path, include, re_path
from usuarios.urls import router as routerUsuario
from roles.urls import router as routerRol
from departamentos.urls import router as routerDepartamentos
from django.views.generic import TemplateView
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="Departamentos FACET",
        default_version='v0.1',
        description="Documentación de las APIs de la aplicación",
        terms_of_service="https://www.google.com/policies/terms/",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = routers.DefaultRouter()
# se extienden los routers de cada app
# router genera solo el api root con las urls
# faltan agregar las que no se registran en router
router.registry.extend(routerUsuario.registry)
router.registry.extend(routerRol.registry)
router.registry.extend(routerDepartamentos.registry)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Usuarios
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/login/', include('usuarios.urls')),

    # Swagger
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Incluir las URLs de departamentos
    path('facet/', include('departamentos.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns.append(re_path(r'^.*', TemplateView.as_view(template_name='index.html')))
