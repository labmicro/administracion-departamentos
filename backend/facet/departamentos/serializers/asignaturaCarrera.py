from rest_framework import serializers
from ..models import AsignaturaCarrera

class AsignaturaCarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignaturaCarrera
        fields = '__all__'
