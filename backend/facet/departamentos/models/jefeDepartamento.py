from django.db import models
from .base import BaseModel
from .departamento import Departamento
from .jefe import Jefe


class JefeDepartamento(BaseModel):

    departamento = models.ForeignKey(
        'Departamento', models.CASCADE)
    
    jefe = models.ForeignKey(
        'Jefe', models.CASCADE)
    
    resolucion = models.ForeignKey(
        'Resolucion', models.CASCADE)
    
    fecha_de_inicio = models.DateTimeField(blank=False, null=False)
    fecha_de_fin = models.DateTimeField(blank=True, null=True)
    observaciones = models.TextField()
    estado = models.CharField(max_length=1,blank=False, null=False)

    def __str__(self):
        return f"{self.jefe.persona.apellido}"

    class Meta:
        ordering = ['id']
        verbose_name = 'JefeDepartamento'
        verbose_name_plural = 'Jefes Departamentos'