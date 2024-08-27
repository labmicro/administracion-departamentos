from ..models import Persona
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ('id','apellido','nombre','dni','telefono','email','estado','interno','legajo','titulo')
    list_filter = ('apellido','nombre','dni','telefono','email','estado','interno','legajo','titulo')
    list_per_page = 15
