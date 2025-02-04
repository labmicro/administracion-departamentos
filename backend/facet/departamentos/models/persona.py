from django.db import models
from .base import BaseModel 
from .tipoTitulo import TipoTitulo

class Persona(BaseModel):
    nombre = models.CharField(blank=False, null=False)
    apellido = models.CharField( blank=False, null=False)
    telefono = models.CharField(blank=True, null=True)
    dni = models.CharField(blank=False, null=False)
    estado = models.CharField(max_length=1)
    email = models.CharField(blank=True, null=True)
    interno = models.IntegerField(blank=True, null=True)
    legajo = models.CharField(blank=True, null=True)
    titulo = models.ForeignKey(TipoTitulo, on_delete=models.SET_NULL, null=True, blank=True)

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