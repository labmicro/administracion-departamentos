from django.db import models
from .base import BaseModel

class DirectorCarrera(BaseModel):

    carrera = models.ForeignKey(
        'Carrera', models.CASCADE)
    
    director = models.ForeignKey(
        'Director', models.CASCADE)
    
    resolucion = models.ForeignKey(
        'Resolucion', models.CASCADE)
    
    fecha_de_inicio = models.DateTimeField(blank=False, null=False)
    fecha_de_fin = models.DateTimeField(blank=True, null=True)
    observaciones = models.TextField()
    estado = models.CharField(max_length=1,blank=False, null=False)

    def __str__(self):
        return f"{self.director.persona.apellido}"

    class Meta:
        ordering = ['id']
        verbose_name = 'Director Carrera'
        verbose_name_plural = 'Directores Carrera'