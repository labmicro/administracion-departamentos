from rest_framework import serializers
from ..models import Jefe
from .persona import PersonaSerializer 

class JefeSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer()
    class Meta:
        model = Jefe
        fields = '__all__'
