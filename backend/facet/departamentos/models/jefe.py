from django.db import models
from .base import BaseModel
from .persona import Persona 

class Jefe(BaseModel):
    persona = models.OneToOneField(
        Persona, 
        on_delete=models.CASCADE)
    
    observaciones = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=1)

    def __str__(self):
        return f"{self.persona.apellido,self.estado}"

    class Meta:
        ordering = ['id']
        verbose_name = 'Jefe'
        verbose_name_plural = 'Jefes'
