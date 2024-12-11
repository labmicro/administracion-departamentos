from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import NoDocente
from ..serializers import NoDocenteSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class NoDocenteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = NoDocente.objects.all()
    serializer_class = NoDocenteSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'estado': ['exact'],       # Filtrar por estado exacto (0 o 1)
        'persona__legajo': ['icontains'],
        'persona__apellido': ['icontains'],
        'persona__nombre': ['icontains'],
        'persona__dni': ['icontains'],
    }

    @action(detail=False, methods=['get'], url_path='buscar_por_persona')
    def buscar_por_persona(self, request):
        persona_id = request.query_params.get('persona_id')
        if persona_id:
            nodocente = self.queryset.filter(persona__id=persona_id).first()
            if nodocente:
                serializer = self.get_serializer(nodocente)
                return Response(serializer.data, status=200)
        return Response({'detail': 'No encontrado'}, status=404)