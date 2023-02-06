from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
from django.utils.timezone import now

from PhotoNotes import settings


class User(AbstractUser):
    """User model"""
    first_name = models.CharField(verbose_name="first name", max_length=150, blank=False, null=False)
    # Key used to verify email
    activation_key = models.CharField(max_length=128, null=True, blank=True)
    # Date of creation of the key to check the functionality of the key (valid for 48 hours)
    activation_key_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    email = models.EmailField(verbose_name="email address", unique=True, blank=False, null=False)

    def is_activation_key_expired(self):
        """Method to check that the email verification key is not expired"""
        if now() <= self.activation_key_created + timedelta(hours=settings.USER_EMAIL_KEY_LIFETIME):
            return False
        return True


class UserProfile(models.Model):
    user = models.ForeignKey(User, verbose_name="User", null=False, db_index=True, on_delete=models.CASCADE)
    image = models.ImageField(verbose_name='User photo', upload_to='user_pics', blank=True)
    info = models.TextField(verbose_name='User info', blank=True)
