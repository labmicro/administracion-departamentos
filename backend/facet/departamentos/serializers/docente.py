from rest_framework import serializers
from ..models import Docente,Persona
from .persona import PersonaSerializer 

class DocenteSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer()  # Para incluir todos los detalles de Persona en la salida

    class Meta:
        model = Docente
        fields = '__all__'

    def create(self, validated_data):
            persona_data = validated_data.pop('persona')
            # Si `Persona` ya existe, se obtiene, si no, se crea una nueva
            persona, created = Persona.objects.get_or_create(**persona_data)
            docente = Docente.objects.create(persona=persona, **validated_data)
            return docente
    
    def update(self, instance, validated_data):
        persona_data = validated_data.pop('persona', None)
        if persona_data:
            # Actualizar la instancia de Persona
            persona, created = Persona.objects.update_or_create(
                id=instance.persona.id, defaults=persona_data
            )
            instance.persona = persona
        
        # Actualizar el resto de los campos de Docente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance