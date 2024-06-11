from django.contrib import admin
from usuarios.models import PasswordHistory

@admin.register(PasswordHistory)
# admin --> agencia @admin.register(Agencia)
class PasswordHistoryAdmin(admin.ModelAdmin):
    list_display = ['id','user','password','created_at','updated_at']
    list_filter = ('user',)
    list_per_page = 10
