from rest_framework import serializers
from ..models import Resolucion

class ResolucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resolucion
        fields = '__all__'
