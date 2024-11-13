from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import JefeDepartamento
from ..serializers import JefeDepartamentoCreateSerializer, JefeDepartamentoDetailSerializer

class JefeDepartamentoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = JefeDepartamento.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'jefe__persona__estado': ['exact'],
        'jefe__persona__legajo': ['icontains'],
        'jefe__persona__apellido': ['icontains'],
        'jefe__persona__nombre': ['icontains'],
        'jefe__persona__dni': ['icontains'],
        'departamento__nombre': ['icontains'],
        'resolucion__nresolucion': ['icontains'],
    }

    def get_serializer_class(self):
        if self.request and self.request.method in ['POST', 'PUT', 'PATCH']:
            return JefeDepartamentoCreateSerializer
        return JefeDepartamentoDetailSerializer

    @action(detail=False, methods=['get'], url_path='list_detalle')
    def list_detalle(self, request):
        # Optimiza la consulta utilizando select_related
        queryset = JefeDepartamento.objects.select_related(
            'jefe__persona', 'departamento', 'resolucion'
        ).all()

        # Construye la respuesta personalizada
        data = [
            {
                'id': depto_jefe.id,
                'observaciones': depto_jefe.observaciones,
                'estado': depto_jefe.estado,
                'fecha_de_inicio': depto_jefe.fecha_de_inicio,
                'fecha_de_fin': depto_jefe.fecha_de_fin,
                'departamento': {
                    'id': depto_jefe.departamento.id,
                    'nombre': depto_jefe.departamento.nombre,
                },
                'resolucion': {
                    'id': depto_jefe.resolucion.id,
                    'nresolucion': depto_jefe.resolucion.nresolucion,
                    'nexpediente': depto_jefe.resolucion.nexpediente,
                },
                'jefe': {
                    'id': depto_jefe.jefe.id,
                    'observaciones': depto_jefe.jefe.observaciones,
                    'persona': {
                        'id': depto_jefe.jefe.persona.id,
                        'nombre': depto_jefe.jefe.persona.nombre,
                        'apellido': depto_jefe.jefe.persona.apellido,
                        'dni': depto_jefe.jefe.persona.dni,
                        'legajo': depto_jefe.jefe.persona.legajo,
                        'telefono': depto_jefe.jefe.persona.telefono,
                        'email': depto_jefe.jefe.persona.email,
                    },
                },
            }
            for depto_jefe in queryset
        ]

        return Response(data)

    @action(detail=True, methods=['get'], url_path='obtener_detalle')
    def obtener_detalle(self, request, pk=None):
        """Obtener detalle de un JefeDepartamento específico con relaciones completas."""
        jefe_departamento = self.get_object()
        data = {
            'id': jefe_departamento.id,
            'observaciones': jefe_departamento.observaciones,
            'estado': jefe_departamento.estado,
            'fecha_de_inicio': jefe_departamento.fecha_de_inicio,
            'fecha_de_fin': jefe_departamento.fecha_de_fin,
            'departamento': {
                'id': jefe_departamento.departamento.id,
                'nombre': jefe_departamento.departamento.nombre,
            },
            'resolucion': {
                'id': jefe_departamento.resolucion.id,
                'nresolucion': jefe_departamento.resolucion.nresolucion,
                'nexpediente': jefe_departamento.resolucion.nexpediente,
            },
            'jefe': {
                'id': jefe_departamento.jefe.id,
                'observaciones': jefe_departamento.jefe.observaciones,
                'persona': {
                    'id': jefe_departamento.jefe.persona.id,
                    'nombre': jefe_departamento.jefe.persona.nombre,
                    'apellido': jefe_departamento.jefe.persona.apellido,
                    'dni': jefe_departamento.jefe.persona.dni,
                    'legajo': jefe_departamento.jefe.persona.legajo,
                    'telefono': jefe_departamento.jefe.persona.telefono,
                    'email': jefe_departamento.jefe.persona.email,
                },
            },
        }
        return Response(data)