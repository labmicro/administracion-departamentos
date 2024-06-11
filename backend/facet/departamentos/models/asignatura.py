from django.db import models
from .base import BaseModel

class Asignatura(BaseModel):
    codigo = models.CharField(max_length=45)
    nombre = models.CharField(max_length=150)
    modulo = models.CharField(max_length=45)
    programa = models.CharField(max_length=45, blank=True, null=True)
    tipo = models.CharField(max_length=11)
    estado = models.CharField(max_length=1)

    area = models.ForeignKey(
        'Area', models.CASCADE)

    departamento = models.ForeignKey(
        'Departamento', models.CASCADE)



    def __str__(self):
        return f"{self.nombre}"

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Asignatura'
        verbose_name_plural = 'Asignaturas'
        constraints = [
            models.UniqueConstraint(
                fields=['codigo'], name='ux_codigo_Asignatura'),
        ]
