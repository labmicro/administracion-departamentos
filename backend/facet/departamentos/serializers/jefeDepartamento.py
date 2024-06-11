from rest_framework import serializers
from ..models import JefeDepartamento

class JefeDepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = JefeDepartamento
        fields = '__all__'
