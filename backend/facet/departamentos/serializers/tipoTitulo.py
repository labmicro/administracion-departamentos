from rest_framework import serializers
from ..models import TipoTitulo

class TipoTituloSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTitulo
        fields = '__all__'
