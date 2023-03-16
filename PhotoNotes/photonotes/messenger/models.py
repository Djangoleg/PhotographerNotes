from django.db import models

# Create your models here.
from users.models import User


class Message(models.Model):
    class MessageStatus(models.IntegerChoices):
        NEW = 1, 'NEW'
        SND = 2, 'SENDED'
        ERR = 3, 'ERROR'

    class SenderType(models.IntegerChoices):
        EMAIL = 1, 'EMAIL'
        TLG = 2, 'TELEGRAM'

    created = models.DateTimeField(verbose_name='Сreated', auto_now_add=True, db_index=True)
    modified = models.DateTimeField(verbose_name='Modified', auto_now=True, db_index=True)
    type = models.PositiveSmallIntegerField(choices=SenderType.choices, default=SenderType.EMAIL)
    recipient_list = models.TextField(verbose_name='Recipients', blank=False, null=False)
    subject = models.TextField(verbose_name='Subject', max_length=250, blank=True, null=True)
    body = models.TextField(verbose_name='Body', blank=False, null=False)
    user = models.ForeignKey(User, verbose_name='User', null=True, on_delete=models.CASCADE)
    status = models.PositiveSmallIntegerField(choices=MessageStatus.choices, default=MessageStatus.NEW)
    error_message = models.TextField(verbose_name='Error message', blank=True, null=True)
