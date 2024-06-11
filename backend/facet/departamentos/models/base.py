from django.db import models
from datetime import datetime
from django.contrib.auth import get_user_model
from django.utils import timezone
User = get_user_model()
# from pytz import timezone

class BaseModel(models.Model):
    id = models.AutoField(primary_key = True)
    estado = models.BooleanField(default = True, verbose_name='Estado')
    fecha_creacion = models.DateTimeField(default=datetime.now, verbose_name='Fecha de creación')
    fecha_modificacion = models.DateTimeField(auto_now=True, auto_now_add=False, verbose_name='Fecha de modificación')
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, default=None, related_name='%(class)s_created_by', verbose_name='Creado por')
    actualizado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, default=None, related_name='%(class)s_updated_by', verbose_name='Actualizado por')
    # direccion_ip = models.CharField(default="0.0.0.0", blank=True, null=True, verbose_name="Direccion IP")

    class Meta:
        abstract = True
        verbose_name = 'Modelo Base'