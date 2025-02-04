from django.db import models
from .base import BaseModel

class TipoTitulo(BaseModel):
    nombre = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Título'
        verbose_name_plural = 'Títulos'