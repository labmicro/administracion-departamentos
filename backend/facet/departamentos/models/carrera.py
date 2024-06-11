from django.db import models
from .base import BaseModel

class Carrera(BaseModel):
    nombre = models.CharField(max_length=150)
    tipo = models.CharField(max_length=8)
    planestudio = models.CharField(max_length=150)
    sitio = models.CharField(max_length=245, blank=True, null=True)
    estado = models.CharField(max_length=1)


    def __str__(self):
        return f"{self.nombre}"

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Carrera'
        verbose_name_plural = 'Carreras'
