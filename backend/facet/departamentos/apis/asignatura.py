from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Asignatura
from ..serializers import AsignaturaSerializer

class AsignaturaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'tipo': ['exact'],         # Filtrar por tipo exacto
        'modulo': ['icontains'],
        'codigo': ['icontains'],
        'nombre': ['icontains'],    # Filtrar por nombre que contiene el valor especificado
    }