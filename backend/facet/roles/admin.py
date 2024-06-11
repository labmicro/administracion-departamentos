from django.contrib import admin
from .models import Rol

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['id','descripcion','estado']
    search_fields = ['descripcion']
    list_filter = ['descripcion']
    list_per_page = 10