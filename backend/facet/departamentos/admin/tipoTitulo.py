from ..models import TipoTitulo
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(TipoTitulo)
class TipoTituloAdmin(admin.ModelAdmin):
    list_display = ('id','nombre')
    list_filter = ('nombre',)
    list_per_page = 15
