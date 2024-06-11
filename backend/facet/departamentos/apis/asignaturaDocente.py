from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import AsignaturaDocente
from ..serializers import AsignaturaDocenteSerializer

class AsignaturaDocenteViewSet(viewsets.ModelViewSet):
    queryset = AsignaturaDocente.objects.all()
    serializer_class = AsignaturaDocenteSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']