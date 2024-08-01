from rest_framework import serializers
from ..models import JefeDepartamento,Jefe,Departamento,Resolucion
from .jefe import JefeSerializer
from .resolucion import ResolucionSerializer
from .departamento import DepartamentoSerializer


class JefeDepartamentoSerializer(serializers.ModelSerializer):

    class Meta:
        model = JefeDepartamento
        fields = '__all__'


class JefeDepartamentoCreateSerializer(serializers.ModelSerializer):
    jefe = serializers.PrimaryKeyRelatedField(queryset=Jefe.objects.all())
    departamento = serializers.PrimaryKeyRelatedField(queryset=Departamento.objects.all())
    resolucion = serializers.PrimaryKeyRelatedField(queryset=Resolucion.objects.all())

    class Meta:
        model = JefeDepartamento
        fields = '__all__'

class JefeDepartamentoDetailSerializer(serializers.ModelSerializer):
    jefe = JefeSerializer()
    departamento = DepartamentoSerializer()
    resolucion = ResolucionSerializer()

    class Meta:
        model = JefeDepartamento
        fields = '__all__'        

    # jefe = JefeSerializer()
    # departamento = DepartamentoSerializer()
    # resolucion = ResolucionSerializer()
    # def create(self, validated_data):
    #     jefe_data = validated_data.pop('jefe')
    #     departamento_data = validated_data.pop('departamento')
    #     resolucion_data = validated_data.pop('resolucion')

    #     jefe, _ = Jefe.objects.get_or_create(**jefe_data)
    #     departamento, _ = Departamento.objects.get_or_create(**departamento_data)
    #     resolucion, _ = Resolucion.objects.get_or_create(**resolucion_data)

    #     jefe_departamento = JefeDepartamento.objects.create(
    #         jefe=jefe,
    #         departamento=departamento,
    #         resolucion=resolucion,
    #         **validated_data
    #     )
    #     return jefe_departamento

    # def update(self, instance, validated_data):
    #     jefe_data = validated_data.pop('jefe', None)
    #     departamento_data = validated_data.pop('departamento', None)
    #     resolucion_data = validated_data.pop('resolucion', None)

    #     if jefe_data:
    #         jefe, _ = Jefe.objects.update_or_create(id=instance.jefe.id, defaults=jefe_data)
    #         instance.jefe = jefe

    #     if departamento_data:
    #         departamento, _ = Departamento.objects.update_or_create(id=instance.departamento.id, defaults=departamento_data)
    #         instance.departamento = departamento

    #     if resolucion_data:
    #         resolucion, _ = Resolucion.objects.update_or_create(id=instance.resolucion.id, defaults=resolucion_data)
    #         instance.resolucion = resolucion

    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()
    #     return instance       