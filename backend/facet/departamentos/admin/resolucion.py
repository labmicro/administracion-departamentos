from ..models import Resolucion
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(Resolucion)
class ResolucionAdmin(admin.ModelAdmin):
    list_display = ('id','nexpediente','nresolucion','tipo','fecha')
    list_filter = ('id','nexpediente','nresolucion','tipo','fecha')
    list_per_page = 15
