from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from ..models import Departamento
from ..serializers import DepartamentoSerializer

class DepartamentoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    filter_backends = [SearchFilter]
    search_fields = ['nombre']
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['nombre']
    # search_fields = ['nombre']