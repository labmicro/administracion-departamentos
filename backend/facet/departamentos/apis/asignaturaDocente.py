from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import AsignaturaDocente
from ..serializers import AsignaturaDocenteSerializer, AsignaturaDocenteCreateSerializer, AsignaturaDocenteDetailSerializer

class AsignaturaDocenteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AsignaturaDocente.objects.all()
    serializer_class = AsignaturaDocenteSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']
    filterset_fields = {
        'docente__persona__estado': ['exact'],
        'docente__persona__legajo': ['icontains'],
        'docente__persona__apellido': ['icontains'],
        'docente__persona__nombre': ['icontains'],
        'docente__persona__dni': ['icontains'],
        'asignatura__nombre': ['icontains'],
        'resolucion__nresolucion': ['icontains'],
    }

    def get_serializer_class(self):
        # Verificar si la solicitud está disponible
        if self.request and self.request.method:
            if self.request.method in ['POST', 'PUT', 'PATCH']:
                return AsignaturaDocenteCreateSerializer
        return AsignaturaDocenteDetailSerializer
    
    @action(detail=False, methods=['get'], url_path='list_detalle')
    def list_detalle(self, request):
        """
        Devuelve los datos de AsignaturaDocente con los datos completos del docente y su persona, 
        incluyendo fecha de inicio y fecha de vencimiento.
        """
        print(request.query_params)
        queryset = AsignaturaDocente.objects.select_related(
            'docente__persona', 'asignatura', 'resolucion'
        ).filter(asignatura__id=request.query_params.get('asignatura'))

        data = [
            {
                'id': asignatura_docente.id,
                'condicion': asignatura_docente.condicion,
                'cargo': asignatura_docente.cargo,
                'dedicacion': asignatura_docente.dedicacion,
                'estado': asignatura_docente.estado,
                'fecha_de_inicio': asignatura_docente.fecha_de_inicio,
                'fecha_de_vencimiento': asignatura_docente.fecha_de_vencimiento,
                'docente': {
                    'id': asignatura_docente.docente.id,
                    'persona': {
                        'id': asignatura_docente.docente.persona.id,
                        'nombre': asignatura_docente.docente.persona.nombre,
                        'apellido': asignatura_docente.docente.persona.apellido,
                        'dni': asignatura_docente.docente.persona.dni,
                        'estado': asignatura_docente.docente.persona.estado,
                    },
                },
            }
            for asignatura_docente in queryset
        ]

        return Response(data)