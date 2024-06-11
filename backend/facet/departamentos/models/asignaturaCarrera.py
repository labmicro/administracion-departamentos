from django.db import models
from .base import BaseModel

class AsignaturaCarrera(BaseModel):

    estado = models.CharField(max_length=1)


    asignatura = models.ForeignKey(
        'Asignatura', models.CASCADE)

    carrera = models.ForeignKey(
        'Carrera', models.CASCADE)



    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ['id']
        verbose_name = 'AsignaturaCarrera'
        verbose_name_plural = 'AsignaturaCarreras'