from django.db import models

# Create your models here.
from notes.models import PhotoNotes
from users.models import User


class PhotoNotesLikes(models.Model):
    """Note likes"""
    note = models.ForeignKey(PhotoNotes, related_name='likes', verbose_name='PhotoNotes', null=False, db_index=True,
                             on_delete=models.CASCADE)
    user = models.ForeignKey(User, verbose_name='User', null=False, db_index=True, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['note', 'user'], name='unique like')
        ]
