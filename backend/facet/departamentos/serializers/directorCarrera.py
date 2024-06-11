from rest_framework import serializers
from ..models import DirectorCarrera

class DirectorCarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorCarrera
        fields = '__all__'
