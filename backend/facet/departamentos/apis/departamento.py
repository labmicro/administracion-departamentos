from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Departamento
from ..serializers import DepartamentoSerializer

class DepartamentoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'telefono': ['icontains'], # Filtrar por teléfono que contiene el valor especificado
        'nombre': ['icontains'],   # Filtrar por nombre que contiene el valor especificado
    }
    # filterset_fields = ['estado', 'telefono']  # Asegúrate de incluir 'telefono' aquí si no lo has hecho
    # search_fields = ['nombre']  # Incluye 'telefono' como campo de búsqueda adicional

    # filterset_fields = ['estado']  # Asegúrate de que el campo 'estado' sea incluido aquí
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']