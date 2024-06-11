from django.db import models
from .base import BaseModel

class Persona(BaseModel):
    nombre = models.CharField(blank=False, null=False)
    apellido = models.CharField( blank=False, null=False)
    telefono = models.CharField(blank=False, null=False)
    dni = models.CharField(blank=False, null=False)
    estado = models.CharField(max_length=1)
    email = models.CharField(blank=True, null=True)
    interno = models.IntegerField(blank=False, null=False)
    legajo = models.CharField(blank=True, null=True)

    def __str__(self):
        return f"{self.apellido,self.nombre}"

    class Meta:
        ordering = ['apellido','nombre']
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'
        constraints = [
            models.UniqueConstraint(
                fields=['dni'], name='ux_dni_personas'),
        ]