from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import NoDocente
from ..serializers import NoDocenteSerializer

class NoDocenteViewSet(viewsets.ModelViewSet):
    queryset = NoDocente.objects.all()
    serializer_class = NoDocenteSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']