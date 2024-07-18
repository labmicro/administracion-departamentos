from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Docente
from ..serializers import DocenteSerializer

class DocenteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Docente.objects.all()
    serializer_class = DocenteSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'persona__estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'persona__legajo': ['icontains'],
        'persona__apellido': ['icontains'],
        'persona__nombre': ['icontains'],
        'persona__dni': ['icontains'],
    }