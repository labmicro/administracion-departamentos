from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Jefe
from ..serializers import JefeSerializer

class JefeViewSet(viewsets.ModelViewSet):
    queryset = Jefe.objects.all()
    serializer_class = JefeSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']