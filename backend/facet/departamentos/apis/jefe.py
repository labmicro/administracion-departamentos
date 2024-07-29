from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Jefe
from ..serializers import JefeSerializer

class JefeViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Jefe.objects.all()
    serializer_class = JefeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'persona__legajo': ['icontains'],
        'persona__apellido': ['icontains'],
        'persona__nombre': ['icontains'],
        'persona__dni': ['icontains'],
    }