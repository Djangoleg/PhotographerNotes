from django.db import models

# Create your models here.
from users.models import User


class Status(models.TextChoices):
    WAITING = 'WAITING', 'Waiting for change'
    SUCCESS = 'SUCCESS', 'Success'
    ERROR = 'ERROR', 'Error'


class PwdActions(models.Model):
    """Password change"""
    created = models.DateTimeField(verbose_name='Сreated', auto_now_add=True, db_index=True)
    modified = models.DateTimeField(verbose_name='Modified', auto_now=True, db_index=True)
    user = models.ForeignKey(User, verbose_name="User", null=True, db_index=True, on_delete=models.CASCADE)
    email = models.EmailField(verbose_name='Email', blank=False, null=True)
    status = models.CharField(verbose_name='Status', choices=Status.choices, max_length=50, blank=True)
    hash_key = models.CharField(max_length=128, null=True, blank=True)
