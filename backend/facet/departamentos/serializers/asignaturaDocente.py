from rest_framework import serializers
from ..models import AsignaturaDocente

class AsignaturaDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignaturaDocente
        fields = '__all__'
