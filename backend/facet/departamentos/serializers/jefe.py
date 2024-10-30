from rest_framework import serializers
from ..models import Jefe, Persona

class JefeSerializer(serializers.ModelSerializer):
    # Permitimos tanto lectura como escritura del ID de persona
    persona = serializers.PrimaryKeyRelatedField(queryset=Persona.objects.all())

    class Meta:
        model = Jefe
        fields = '__all__'

    def update(self, instance, validated_data):
        persona_id = validated_data.pop('persona', None)

        # Solo actualiza la persona si se ha proporcionado un nuevo ID y es diferente del actual
        if persona_id and instance.persona_id != persona_id:
            instance.persona_id = persona_id

        # Actualizar el resto de los campos de Jefe
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
