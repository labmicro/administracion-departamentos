from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import JefeDepartamento
from ..serializers import JefeDepartamentoSerializer

class JefeDepartamentoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = JefeDepartamento.objects.all()
    serializer_class = JefeDepartamentoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'jefe__persona__estado': ['exact'],
        'jefe__persona__legajo': ['icontains'],
        'jefe__persona__apellido': ['icontains'],
        'jefe__persona__nombre': ['icontains'],
        'jefe__persona__dni': ['icontains'],
        'departamento__nombre': ['icontains'],  # Permite coincidencia parcial de texto
        'resolucion__nresolucion': ['icontains'],    # Permite coincidencia parcial de texto
    }
