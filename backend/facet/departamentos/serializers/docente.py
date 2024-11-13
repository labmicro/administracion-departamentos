from rest_framework import serializers
from ..models import Docente, Persona

class DocenteSerializer(serializers.ModelSerializer):
    # Agregamos el ID de persona para escritura y un campo adicional para mostrar los datos completos
    persona = serializers.PrimaryKeyRelatedField(queryset=Persona.objects.all())
    persona_detalle = serializers.SerializerMethodField()

    class Meta:
        model = Docente
        fields = '__all__'  # Incluye todos los campos, incluyendo persona y persona_detalle

    def get_persona_detalle(self, obj):
        """Obtiene los detalles completos de la persona relacionada"""
        if obj.persona:
            return {
                "id": obj.persona.id,
                "nombre": obj.persona.nombre,
                "apellido": obj.persona.apellido,
                "dni": obj.persona.dni,
                "telefono": obj.persona.telefono,
                "legajo": obj.persona.legajo,
                "email": obj.persona.email,
            }
        return None

    def update(self, instance, validated_data):
        # Extrae el ID de persona de validated_data si existe
        persona_id = validated_data.pop('persona', None)

        # Si se proporciona un nuevo ID de persona, actualízalo
        if persona_id and instance.persona_id != persona_id.id:  # Asegúrate de que persona_id sea solo el ID
            instance.persona_id = persona_id  # Solo asigna el ID

        # Actualizar otros campos de Docente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

