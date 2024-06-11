from ..models import Asignatura
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(Asignatura)
class AsignaturaAdmin(admin.ModelAdmin):
    list_display = ('codigo','nombre','estado',)
    list_filter = ('codigo','nombre','estado')
    list_per_page = 15
