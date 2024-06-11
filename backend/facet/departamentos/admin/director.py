from ..models import Director
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ('persona',)
    list_filter = ('persona__apellido','observaciones','estado')
    list_per_page = 15
