from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Persona
from ..serializers import PersonaSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

class PersonaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Persona.objects.select_related('titulo').all() 
    serializer_class = PersonaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'legajo': ['icontains'],       
        'apellido': ['icontains'], 
        'nombre': ['icontains'],
        'dni': ['icontains'], 
    }

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Debugging: Verificar que se ejecuta el método

        # Aplica paginación si está configurada en DRF
        page = self.paginate_queryset(queryset)
        if page is not None:
            personas_data = [
                {
                    'id': persona.id,
                    'nombre': persona.nombre,
                    'apellido': persona.apellido,
                    'telefono': persona.telefono,
                    'dni': persona.dni,
                    'estado': persona.estado,
                    'email': persona.email,
                    'interno': persona.interno,
                    'legajo': persona.legajo,
                    'titulo': persona.titulo.nombre if persona.titulo else None  # 🔥 Ahora devuelve el nombre del título
                }
                for persona in page
            ]
            return self.get_paginated_response(personas_data)

        # Si no hay paginación, devolver la lista completa
        personas_data = [
            {
                'id': persona.id,
                'nombre': persona.nombre,
                'apellido': persona.apellido,
                'telefono': persona.telefono,
                'dni': persona.dni,
                'estado': persona.estado,
                'email': persona.email,
                'interno': persona.interno,
                'legajo': persona.legajo,
                'titulo': persona.titulo.nombre if persona.titulo else None
            }
            for persona in queryset
        ]

        return Response(personas_data)
