from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import JefeDepartamento
from ..serializers import JefeDepartamentoCreateSerializer, JefeDepartamentoDetailSerializer

class JefeDepartamentoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = JefeDepartamento.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'jefe__persona__estado': ['exact'],
        'jefe__persona__legajo': ['icontains'],
        'jefe__persona__apellido': ['icontains'],
        'jefe__persona__nombre': ['icontains'],
        'jefe__persona__dni': ['icontains'],
        'departamento__nombre': ['icontains'],
        'resolucion__nresolucion': ['icontains'],
    }

    def get_serializer_class(self):
        # Verificar si la solicitud está disponible
        if self.request and self.request.method:
            if self.request.method in ['POST', 'PUT', 'PATCH']:
                return JefeDepartamentoCreateSerializer
        return JefeDepartamentoDetailSerializer