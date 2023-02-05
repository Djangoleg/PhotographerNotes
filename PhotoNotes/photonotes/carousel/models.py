from django.db import models


# Create your models here.
class Carousel(models.Model):
    """Photo carousel in index page"""
    created = models.DateTimeField(verbose_name='Date of creation', auto_now_add=True, db_index=True)
    title = models.TextField(verbose_name='Title', max_length=250, blank=True, null=True)
    image = models.ImageField(verbose_name='Image', upload_to='index_photo', blank=True)
    is_active = models.BooleanField(verbose_name='Is active', default=True, db_index=True)
