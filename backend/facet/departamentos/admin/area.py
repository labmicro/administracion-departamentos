from ..models import Area
from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('nombre','estado',)
    list_filter = ('nombre','estado')
    list_per_page = 15
