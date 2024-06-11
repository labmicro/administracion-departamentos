from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from ..forms import UserChangeForm, UserCreationForm
Usuario = get_user_model()

@admin.register(Usuario) 
class UsuarioAdmin(auth_admin.UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    list_display = ['id','email','is_active','nombre','apellido','documento','is_staff','rol','date_joined', 'last_login', 'has_changed_password','last_password_change']
    list_filter = ['is_active','email','documento','date_joined']
    search_fields = ['email','nombre','apellido','rol']
    ordering = ['email']
    
    def get_fieldsets(self, request, obj=None):
            if not obj:
                return (
                        (None, {"fields": ("email", "password1", "password2")}),
                        ("Datos del Empleado", {"fields": ("nombre", "apellido", "documento", "legajo","rol")}),
                        (
                            _("Permissions"),
                            {
                                "fields": (
                                    "is_active",
                                    "is_staff",
                                    "is_superuser",
                                    "groups",
                                    "user_permissions",
                                ),
                            },
                        ),
                        )
            else:
                return (
                    (None, {"fields": ("email", "password","date_joined")}),
                    ("Empleado", {"fields": ("nombre", "apellido", "documento","legajo","rol",)}),
                    ("Password", {"fields": ("has_changed_password","last_password_change")}),
                    (
                        _("Permissions"),
                        {
                            "fields": (
                                "is_active",
                                "is_staff",
                                "is_superuser",
                                "groups",
                                "user_permissions",
                            ),
                        },
                    ),
                )
