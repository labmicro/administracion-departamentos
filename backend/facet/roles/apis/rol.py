from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from ..serializers import RolSerializer
from ..models import Rol
from rest_framework import viewsets

class RolViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar Tipo sorteo.
    """
    queryset = Rol.objects.all().order_by('descripcion')
    serializer_class = RolSerializer
    permission_classes = [permissions.IsAuthenticated] # Se pueden ver solo si el usuario esta autenticado
    

    @action(detail=False, methods=['get'], url_path=r'busqueda/(?P<descripcion>[a-z A-Z 0-9]+)', name='Busqueda')
    def busqueda(self, request, descripcion, *args, **kwargs):
        if (Rol.objects.filter(descripcion = descripcion).exists()):
            queryset = Rol.objects.filter(descripcion = descripcion).first()
            serializer = self.get_serializer(queryset, many=False)
            return Response(serializer.data)
        else : 
            return Response({'error': "No se encuentra el rol que esta solicitando"}, status=status.HTTP_400_BAD_REQUEST)
