from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import AsignaturaCarrera
from ..serializers import AsignaturaCarreraSerializer

class AsignaturaCarreraViewSet(viewsets.ModelViewSet):
    queryset = AsignaturaCarrera.objects.all()
    serializer_class = AsignaturaCarreraSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']