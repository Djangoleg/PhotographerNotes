from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

# Create your models here.
from notes.models import PhotoNotes
from users.models import User


class Comments(MPTTModel):
    """Comment to post"""
    created = models.DateTimeField(verbose_name='Сreated', auto_now_add=True, db_index=True)
    body = models.TextField(verbose_name='Comment')
    user = models.ForeignKey(User, verbose_name='User', null=True, db_index=True, on_delete=models.CASCADE)
    note = models.ForeignKey(PhotoNotes, verbose_name='PhotoNote', db_index=True, on_delete=models.CASCADE)
    parent = TreeForeignKey('self', verbose_name='Parent', related_name='children', null=True,
                            blank=True, db_index=True, on_delete=models.CASCADE)
