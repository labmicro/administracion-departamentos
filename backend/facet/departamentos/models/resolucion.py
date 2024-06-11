from django.db import models
from .base import BaseModel

class Resolucion(BaseModel):
    nexpediente = models.CharField(max_length=100,blank=False, null=False)
    nresolucion = models.CharField(max_length=100,blank=False, null=False)
    tipo = models.CharField(max_length=17,blank=False, null=False)
    adjunto = models.CharField(max_length=256,blank=False, null=False)
    observaciones = models.TextField(blank=True, null=True)
    fechadecarga = models.DateTimeField(blank=False, null=False)
    fecha = models.DateTimeField(blank=False, null=False)
    estado = models.CharField(max_length=1,blank=False, null=False)

    def __str__(self):
        return f"{self.nresolucion,self.nexpediente}"

    class Meta:
        ordering = ['nexpediente','nresolucion']
        verbose_name = 'Resolucion'
        verbose_name_plural = 'Resoluciones'
