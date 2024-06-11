from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Rol(models.Model):
    """ Modelo para la tabla Roles """
    id = models.AutoField(primary_key = True)
    estado = models.BooleanField(default = True, verbose_name='Estado')
    fecha_creacion = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Fecha de creación')
    fecha_modificacion = models.DateTimeField(auto_now=True, auto_now_add=False, verbose_name='Fecha de modificación')
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, default=None, verbose_name='Creado por', related_name='rol_creado_por')
    descripcion = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Descripción"
    )
    # Guardado en mayusculas
    def save(self, *args, **kwargs):
        self.descripcion = self.descripcion.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.descripcion}"
    
    class Meta:
        ordering = ['id']
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
