from rest_framework import serializers
from ..models import Jefe,Persona
from .persona import PersonaSerializer 

class JefeSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer()  # Para incluir todos los detalles de Persona en la salida

    class Meta:
        model = Jefe
        fields = '__all__'

    def create(self, validated_data):
            persona_data = validated_data.pop('persona')
            # Si `Persona` ya existe, se obtiene, si no, se crea una nueva
            persona, created = Persona.objects.get_or_create(**persona_data)
            jefe = Jefe.objects.create(persona=persona, **validated_data)
            return jefe
    
    def update(self, instance, validated_data):
        persona_data = validated_data.pop('persona', None)
        if persona_data:
            # Actualizar la instancia de Persona
            persona, created = Persona.objects.update_or_create(
                id=instance.persona.id, defaults=persona_data
            )
            instance.persona = persona
        
        # Actualizar el resto de los campos de Jefe
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance