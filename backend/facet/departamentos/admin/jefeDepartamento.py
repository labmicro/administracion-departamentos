from ..models import JefeDepartamento
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(JefeDepartamento)
class JefeDepartamentoAdmin(admin.ModelAdmin):
    list_display = ('id',)
    list_filter = ('jefe__persona__apellido',)
    list_per_page = 15
