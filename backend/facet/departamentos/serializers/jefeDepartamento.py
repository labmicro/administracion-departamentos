from rest_framework import serializers
from ..models import JefeDepartamento
from .jefe import JefeSerializer
from .resolucion import ResolucionSerializer
from .departamento import DepartamentoSerializer

class JefeDepartamentoSerializer(serializers.ModelSerializer):
    jefe = JefeSerializer()
    departamento = DepartamentoSerializer()
    resolucion = ResolucionSerializer()

    class Meta:
        model = JefeDepartamento
        fields = '__all__'