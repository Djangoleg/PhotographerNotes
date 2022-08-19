from django.db import models

# Create your models here.
from notes.models import PhotoNotes
from users.models import User


class Comments(models.Model):
    """Комментарий к фото"""
    created = models.DateTimeField(verbose_name='Дата создания', auto_now_add=True, db_index=True)
    body = models.TextField(verbose_name='Комментарий')
    user = models.ForeignKey(User, null=False, db_index=True, on_delete=models.CASCADE)
    photonotes = models.ForeignKey(PhotoNotes, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', blank=True, null=True, related_name='children', on_delete=models.CASCADE)
