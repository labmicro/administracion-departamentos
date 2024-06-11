from django.db import models
from .base import BaseModel

class Area(BaseModel):
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=1)
    departamento = models.ForeignKey(
        'Departamento', models.CASCADE)



    def __str__(self):
        return f"{self.nombre}"

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Area'
        verbose_name_plural = 'Areas'
        constraints = [
            models.UniqueConstraint(
                fields=['nombre'], name='ux_nombre_area'),
        ]
