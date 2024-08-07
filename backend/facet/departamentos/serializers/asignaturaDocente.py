from rest_framework import serializers
from ..models import AsignaturaDocente,Docente,Asignatura,Resolucion
from .docente import DocenteSerializer
from .resolucion import ResolucionSerializer
from .asignatura import AsignaturaSerializer

class AsignaturaDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignaturaDocente
        fields = '__all__'

class AsignaturaDocenteCreateSerializer(serializers.ModelSerializer):
    docente = serializers.PrimaryKeyRelatedField(queryset=Docente.objects.all())
    asignatura = serializers.PrimaryKeyRelatedField(queryset=Asignatura.objects.all())
    resolucion = serializers.PrimaryKeyRelatedField(queryset=Resolucion.objects.all())

    class Meta:
        model = AsignaturaDocente
        fields = '__all__'

class AsignaturaDocenteDetailSerializer(serializers.ModelSerializer):
    docente = DocenteSerializer()
    asignatura = AsignaturaSerializer()
    resolucion = ResolucionSerializer()

    class Meta:
        model = AsignaturaDocente
        fields = '__all__'        