from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Carrera
from ..serializers import CarreraSerializer

class CarreraViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'tipo': ['exact'],         # Filtrar por tipo exacto
        'planestudio': ['icontains'], # Filtrar por plan de estudio que contiene el valor especificado
        'nombre': ['icontains'],   # Filtrar por nombre que contiene el valor especificado
    }
    print(filterset_fields)
