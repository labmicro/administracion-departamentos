from django.db import models
from .base import BaseModel

class AsignaturaDocente(BaseModel):

    condicion = models.CharField(max_length=11)
    cargo = models.CharField(max_length=20)
    dedicacion = models.CharField(max_length=9)
    fecha_de_inicio = models.DateTimeField(blank=True, null=True)
    fecha_de_vencimiento = models.DateTimeField(blank=True, null=True)
    observaciones = models.TextField()
    estado = models.CharField(max_length=1)


    asignatura = models.ForeignKey(
        'Asignatura', models.CASCADE)

    docente = models.ForeignKey(
        'Docente', models.CASCADE)
    
    resolucion = models.ForeignKey(
        'Resolucion', models.CASCADE)



    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ['id']
        verbose_name = 'AsignaturaDocente'
        verbose_name_plural = 'AsignaturaDocentes'