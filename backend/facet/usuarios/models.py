from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserManager(BaseUserManager):
    """
        Clase para manejar las instancias de usuario. Similar a un gestor
    """
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Usuarios requieren un email')
        email = self.normalize_email(email)
        # se crea el usuario
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        # creacion de usuario no superusuario
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superusuario debe tener is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    # from django.apps import apps
    # Rol = apps.get_model('roles', 'Rol')
    """ Modelo para la tabla Usuarios """
    # atributos que se heredan de AbstractUser y no se usaran
    username = None # username sera email
    first_name = None # nombre
    last_name = None # apellido
    # ---------------------------
    email = models.EmailField(
        max_length=255,
        unique=True,
        verbose_name='Dirección de email',
    )
    nombre = models.CharField(
        max_length=150, 
        blank=True,
        null=True,
        verbose_name="Nombre"
    )
    apellido = models.CharField(
        max_length=150, 
        blank=True,
        null=True,
        verbose_name="Apellido"
    )
    legajo = models.PositiveIntegerField(
        unique=True,
        null=True,
        blank=True,
        verbose_name="Legajo CPA"
    )
    documento = models.PositiveIntegerField(
        unique=True,
        null=True,
        blank=True,
        verbose_name="Documento"
    )
    rol = models.ForeignKey(
        'roles.Rol',
        on_delete= models.CASCADE,
        null=True,
    )
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    # no se agregan required_fields
    # para no tener conflicto con el email, al ser este el campo username
    # Indicar si el usuario ha cambiado su clave
    has_changed_password = models.BooleanField(
        default=False,
        verbose_name='¿Ha cambiado su clave por 1ra vez?',
    )
    # Fecha de ultimo cambio de clave
    last_password_change = models.DateTimeField(null=True, blank=True,verbose_name='Ultimo cambio clave')

    
    class Meta:
        # db_table = 'Usuarios'                 # define el nombre de la tabla en la base de datos, si no se pone, sera por defecto nombreapp_nombreclase
        ordering = ['-date_joined']
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return self.email

class PasswordHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    password = models.CharField(max_length=128, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now = True)

    class Meta:
        ordering = ['created_at']

@receiver(post_save, sender=User)
def update_has_changed_password(sender, instance, created, **kwargs):
    """
    Actualiza el campo has_changed_password cuando el usuario cambia su clave.
    """
    if instance.has_usable_password() and not instance.has_changed_password:
        try:
            previous_instance = User.objects.get(pk=instance.pk)
            if previous_instance.has_changed_password != instance.has_changed_password:
                instance.has_changed_password = True
                instance.save()
        except User.DoesNotExist:
            # Si no se encuentra un usuario previo, no se hace nada
            pass

# Aplicar el decorador @receiver a la función update_has_changed_password
receiver(post_save, sender=User)(update_has_changed_password)
