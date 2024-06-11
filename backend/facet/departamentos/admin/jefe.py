from ..models import Jefe
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(Jefe)
class JefeAdmin(admin.ModelAdmin):
    list_display = ('persona',)
    list_filter = ('persona__apellido','observaciones','estado')
    list_per_page = 15
