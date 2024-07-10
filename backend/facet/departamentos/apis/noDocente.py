from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import NoDocente
from ..serializers import NoDocenteSerializer

class NoDocenteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = NoDocente.objects.all()
    serializer_class = NoDocenteSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'persona__estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'persona__legajo': ['icontains'],
        'persona__apellido': ['icontains'],
        'persona__nombre': ['icontains'],
        'persona__dni': ['icontains'],
    }