from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import DirectorCarrera
from ..serializers import DirectorCarreraSerializer

class DirectorCarreraViewSet(viewsets.ModelViewSet):
    queryset = DirectorCarrera.objects.all()
    serializer_class = DirectorCarreraSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']