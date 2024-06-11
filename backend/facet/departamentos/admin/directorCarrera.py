from ..models import DirectorCarrera
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(DirectorCarrera)
class DirectorCarreraAdmin(admin.ModelAdmin):
    list_display = ('id',)
    list_filter = ('director__persona__apellido',)
    list_per_page = 15
