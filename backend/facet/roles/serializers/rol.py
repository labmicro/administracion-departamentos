from rest_framework import serializers
from ..models import Rol

class RolSerializer(serializers.ModelSerializer):
    """ Serializador para modelo Rol """
    class Meta:
        model = Rol
        fields = ['id','descripcion']
