from ..models import Departamento
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nombre','estado',)
    list_filter = ('nombre','estado')
    list_per_page = 15
