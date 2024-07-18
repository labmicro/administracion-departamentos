from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Persona
from ..serializers import PersonaSerializer

class PersonaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'legajo': ['icontains'],       
        'apellido': ['icontains'], 
        'nombre': ['icontains'],
        'dni': ['icontains'], 
    }