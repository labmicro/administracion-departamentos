from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import AsignaturaDocente
from ..serializers import AsignaturaDocenteSerializer, AsignaturaDocenteCreateSerializer, AsignaturaDocenteDetailSerializer

class AsignaturaDocenteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AsignaturaDocente.objects.all()
    serializer_class = AsignaturaDocenteSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']
    filterset_fields = {
        'docente__persona__estado': ['exact'],
        'docente__persona__legajo': ['icontains'],
        'docente__persona__apellido': ['icontains'],
        'docente__persona__nombre': ['icontains'],
        'docente__persona__dni': ['icontains'],
        'asignatura__nombre': ['icontains'],
        'resolucion__nresolucion': ['icontains'],
    }

    def get_serializer_class(self):
        # Verificar si la solicitud está disponible
        if self.request and self.request.method:
            if self.request.method in ['POST', 'PUT', 'PATCH']:
                return AsignaturaDocenteCreateSerializer
        return AsignaturaDocenteDetailSerializer