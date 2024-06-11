from rest_framework import serializers
from ..models import Jefe

class JefeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jefe
        fields = '__all__'
