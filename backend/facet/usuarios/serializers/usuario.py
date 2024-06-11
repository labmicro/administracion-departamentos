from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from administracion.settings import SIMPLE_JWT
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import update_last_login
from django.contrib.auth.hashers import check_password
from datetime import timedelta
from django.utils import timezone
User = get_user_model()

from django.contrib.auth.tokens import default_token_generator


class UserSerializer(serializers.ModelSerializer):
    """ Serializador para el modelo User """
    def __init__(self, *args, **kwargs):
        """ Omite el control de password para el método PUT """
        super(UserSerializer, self).__init__(*args, **kwargs)
        if 'request' in self.context and self.context['request'].method == "PUT":
            self.fields.pop('password')
            
    password = serializers.CharField(
        write_only=True,
        required=True,
        help_text='Dejar vacío si no hacen falta cambios',
        style={'input_type': 'password', 'placeholder': 'Password'}
    )
    rol_detalle = serializers.CharField(source='rol.descripcion', read_only=True)

    class Meta:
        model = User
        fields = ['id','email','password','nombre','apellido','legajo','documento','rol','rol_detalle','is_active','groups','date_joined','last_login']
        
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).create(validated_data)
    



class GroupSerializer(serializers.ModelSerializer):
    """ Serializador para el modelo Groups """
    class Meta:
        model = Group
        fields = ['id','name']
        
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """ Serializador del token """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        # ...
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["rol"] = self.user.rol.descripcion if self.user.rol else None

        if SIMPLE_JWT["UPDATE_LAST_LOGIN"]:
            update_last_login(None, self.user)

        # Verificar si el usuario ha ingresado la clave por defecto
        is_default_password = check_password(str(self.user.documento), self.user.password)


       # Control para saber si cambio la clave hace mas de 30 dias, si el resultado es verdadero debera cambiar su clave 
        if self.user.last_password_change: 
            last_password_change_bool = self.user.last_password_change >= timezone.now() - timedelta(days=30)
        else:
            last_password_change_bool = False

        # Retorna False si es clave por defecto o si pasaron mas de 30 dias sin cambiar la clave 
        data["has_changed_password"] = self.user.has_changed_password and last_password_change_bool

        return data
    
# Envio de mail para reestablecer la clave    
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('No existe un usuario con ese correo electrónico.')
        return value

# Nueva clave para reestablecer
class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField()
    confirm_new_password = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError('Las contraseñas no coinciden.')
        return data

# Nueva clave para reestablecer clave si se ingresa por primera vez o si se quiere cambiar la clave
class CambiarClaveSerializer(serializers.Serializer):
    email = serializers.EmailField()
    newPassword = serializers.CharField(write_only=True)
    currentPassword = serializers.CharField(required=False, write_only=True, allow_null=True)
    confirmPassword = serializers.CharField( write_only=True)
    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)
        return valid