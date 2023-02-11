from django.db import models

# Create your models here.
from users.models import User


class PhotoNotes(models.Model):
    """Note"""
    created = models.DateTimeField(verbose_name='Сreated', auto_now_add=True, db_index=True)
    modified = models.DateTimeField(verbose_name='Modified', auto_now=True, db_index=True)
    title = models.TextField(verbose_name='Title', max_length=250, blank=True, null=True)
    image = models.ImageField(verbose_name='Image', upload_to='post_photo', blank=True)
    imageminicard = models.ImageField(verbose_name='Image mini cards', upload_to='post_photo', blank=True)
    photo_comment = models.TextField(verbose_name='Comment')
    user = models.ForeignKey(User, verbose_name='User', null=True, blank=True, on_delete=models.CASCADE)
    pinned = models.BooleanField(verbose_name='Pinned', default=False, db_index=True)


class PhotoNotesTags(models.Model):
    """Note tags"""
    note = models.ForeignKey(PhotoNotes, related_name='tags', verbose_name='PhotoNotes', null=False, db_index=True,
                             on_delete=models.CASCADE)
    value = models.TextField(verbose_name='Value', max_length=250, blank=False, null=False, db_index=True)

    def __str__(self):
        return self.value
