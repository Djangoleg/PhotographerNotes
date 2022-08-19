from django.db import models

# Create your models here.
from users.models import User


class PhotoNotes(models.Model):
    """Заметка фотографа"""
    created = models.DateTimeField(verbose_name='Дата создания', auto_now_add=True, db_index=True)
    title = models.TextField(verbose_name='Заголовок', max_length=250, blank=True, null=True)
    image = models.ImageField(upload_to='post_photo', blank=True)
    photo_comment = models.TextField(verbose_name='Комментарий к фото')
    user = models.ForeignKey(User, null=False, db_index=True, on_delete=models.CASCADE)
    use_on_index = models.BooleanField(default=True, db_index=True)


