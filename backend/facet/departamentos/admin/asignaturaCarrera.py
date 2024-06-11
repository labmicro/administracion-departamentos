from ..models import AsignaturaCarrera
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(AsignaturaCarrera)
class AsignaturaCarreraAdmin(admin.ModelAdmin):
    list_display = ('carrera','asignatura','estado')
    list_filter = ('carrera__nombre','asignatura__nombre','estado')
    list_per_page = 15
