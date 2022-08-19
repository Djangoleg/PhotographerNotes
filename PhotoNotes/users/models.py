from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
from django.utils.timezone import now

from PhotoNotes import settings


class Role(models.Model):
    """Группы пользователей: Пользователь, автор"""
    role_name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.role_name


class User(AbstractUser):
    """Модель пользователя"""
    role = models.ForeignKey(Role, null=True, db_constraint=False, on_delete=models.CASCADE)
    # ключ используемый для подтверждения email
    activation_key = models.CharField(max_length=128, null=True, blank=True)
    # дата создания ключа для проверки работоспособности ключа (действует 48 часов)
    activation_key_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def is_activation_key_expired(self):
        """метод для проверки, что ключ проверки email не просрочен"""
        if now() <= self.activation_key_created + timedelta(hours=settings.USER_EMAIL_KEY_LIFETIME):
            return False
        return True
