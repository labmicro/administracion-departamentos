from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django.urls import reverse_lazy
from usuarios.models import User


class UserCreationForm(forms.ModelForm):
    """Formulario para crear nuevos usuarios. Incluye todos los campos
    requeridos, además de una confirmación de clave."""
    password1 = forms.CharField(label='Clave', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirmación de clave', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email',)

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Las claves no coinciden")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """ Formulario para editar usuarios. Incluye algunos de los campos
        requeridos del usuario, pero reemplaza la clave con el campo
        del admin de la clave (admin's disabled password hash display field)
    """
    password = ReadOnlyPasswordHashField()
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password'].help_text = (
            "Raw passwords are not stored, so there is no way to see "
            "this user's password, but you can change the Password using "
            "<a href=\"%s\"><strong>this form</strong></a>."
        ) % reverse_lazy('admin:auth_user_password_change', args=[self.instance.id])

    class Meta:
        model = User
        fields = '__all__'
