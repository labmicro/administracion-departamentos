from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import AsignaturaCarrera
from ..serializers import AsignaturaCarreraSerializer

class AsignaturaCarreraViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AsignaturaCarrera.objects.all()
    serializer_class = AsignaturaCarreraSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']
    filterset_fields = {
        'idcarrera': ['exact'],  # Permite filtrar por idcarrera
    }