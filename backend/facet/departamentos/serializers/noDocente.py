from rest_framework import serializers
from ..models import NoDocente

class NoDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoDocente
        fields = '__all__'
