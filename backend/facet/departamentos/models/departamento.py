from django.db import models
from .base import BaseModel

class Departamento(BaseModel):
    nombre = models.CharField(max_length=150 , blank=False, null=False)
    telefono = models.CharField(max_length=45, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=False, null=False)
    interno = models.CharField(max_length=45, blank=True, null=True)


    def __str__(self):
        return f"{self.nombre}"

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'
