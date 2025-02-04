from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import TipoTitulo
from ..serializers import TipoTituloSerializer

class TipoTituloViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = TipoTitulo.objects.all()
    serializer_class = TipoTituloSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'nombre': ['icontains'],  # Filtrar por nombre que contenga el valor especificado
    }
