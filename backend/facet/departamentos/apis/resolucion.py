from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Resolucion
from ..serializers import ResolucionSerializer

class ResolucionViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Resolucion.objects.all()
    serializer_class = ResolucionSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],
        'nexpediente': ['icontains'], 
        'nresolucion': ['icontains'],
        'tipo': ['exact'], 
        'fecha': ['date'], 
    }
