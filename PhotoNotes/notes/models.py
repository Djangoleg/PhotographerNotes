from django.db import models

# Create your models here.
from users.models import User


class PhotoNotes(models.Model):
    """Заметка фотографа"""
    created = models.DateTimeField(verbose_name='Сreated', auto_now_add=True, db_index=True)
    modified = models.DateTimeField(verbose_name='Modified', auto_now=True, db_index=True)
    title = models.TextField(verbose_name='Title', max_length=250, blank=True, null=True)
    image = models.ImageField(verbose_name='Image', upload_to='post_photo', blank=True)
    photo_comment = models.TextField(verbose_name='Comment')
    user = models.ForeignKey(User, verbose_name='User', null=False, db_index=True, on_delete=models.CASCADE)


