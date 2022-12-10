from django.db import models

# Create your models here.
from notes.models import PhotoNotes
from users.models import User


class Comments(models.Model):
    """Comment to post"""
    created = models.DateTimeField(verbose_name='Сreated', auto_now_add=True, db_index=True)
    body = models.TextField(verbose_name='Comment')
    user = models.ForeignKey(User, verbose_name='User', null=False, db_index=True, on_delete=models.CASCADE)
    photonotes = models.ForeignKey(PhotoNotes, verbose_name='PhotoNote', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', verbose_name='Parent', blank=True, null=True, on_delete=models.CASCADE)
