from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from ..models import Jefe
from ..serializers import JefeSerializer  # Asegúrate de importar el serializer


class JefeViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Jefe.objects.all()
    serializer_class = JefeSerializer  # Agrega el serializer_class aquí
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'estado': ['exact'],
        'persona__legajo': ['icontains'],
        'persona__apellido': ['icontains'],
        'persona__nombre': ['icontains'],
        'persona__dni': ['icontains'],
    }

    @action(detail=False, methods=['get'], url_path='list_jefes_persona')
    def list_jefes_persona(self, request):
        # Realizar la consulta de Jefes con datos de Persona
        jefes = Jefe.objects.select_related('persona').all()

        # Construir la respuesta manualmente
        jefes_data = [
            {
                'id': jefe.id,
                'observaciones': jefe.observaciones,
                'estado': jefe.estado,
                'persona': {
                    'id': jefe.persona.id,
                    'nombre': jefe.persona.nombre,
                    'apellido': jefe.persona.apellido,
                    'dni': jefe.persona.dni,
                    'legajo': jefe.persona.legajo,
                    'telefono': jefe.persona.telefono,
                    'email': jefe.persona.email,
                    'interno': jefe.persona.interno,
                }
            }
            for jefe in jefes
        ]

        return Response(jefes_data)

    @action(detail=True, methods=['get'], url_path='obtener_jefe')
    def obtener_jefe(self, request, pk=None):
        # Obtener el jefe con datos relacionados de Persona
        jefe = Jefe.objects.select_related('persona').filter(id=pk).first()
        if jefe:
            data = {
                'id': jefe.id,
                'observaciones': jefe.observaciones,
                'estado': jefe.estado,
                'persona': {
                    'id': jefe.persona.id,
                    'nombre': jefe.persona.nombre,
                    'apellido': jefe.persona.apellido,
                    'dni': jefe.persona.dni,
                    'legajo': jefe.persona.legajo,
                    'telefono': jefe.persona.telefono,
                    'email': jefe.persona.email,
                }
            }
            return Response(data)
        else:
            return Response({'detail': 'Jefe no encontrado'}, status=404)
