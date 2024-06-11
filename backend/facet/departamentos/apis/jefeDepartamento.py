from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import JefeDepartamento
from ..serializers import JefeDepartamentoSerializer

class JefeDepartamentoViewSet(viewsets.ModelViewSet):
    queryset = JefeDepartamento.objects.all()
    serializer_class = JefeDepartamentoSerializer
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']