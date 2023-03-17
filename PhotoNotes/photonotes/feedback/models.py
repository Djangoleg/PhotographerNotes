from django.db import models


# Create your models here.
from messenger.models import Message
from users.models import User


class Feedback(models.Model):
    """Feedback form data"""
    created = models.DateTimeField(verbose_name='Сreated', auto_now_add=True, db_index=True)
    title = models.TextField(verbose_name='Title', max_length=250, blank=True, null=True)
    body = models.TextField(verbose_name='Body')
    communication = models.TextField(verbose_name='Communication', max_length=250, blank=True, null=True)
    user = models.ForeignKey(User, verbose_name='User', null=True, db_index=True, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, verbose_name='Message', null=True, on_delete=models.CASCADE)
