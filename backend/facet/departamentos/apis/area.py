from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Area
from ..serializers import AreaSerializer

class AreaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'nombre': ['icontains'],   # Filtrar por nombre que contiene el valor especificado
    }

