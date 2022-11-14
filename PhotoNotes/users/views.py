import hashlib
import random

from django.contrib import auth
from django.core.mail import send_mail
from django.http import JsonResponse

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.viewsets import ModelViewSet

from PhotoNotes import settings
from users.models import User
from users.serializers import UserModelSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        return UserModelSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)

        self.added_activation_key(user)

        # Send a confirmation email
        self.send_verify_link(user)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def added_activation_key(self, user):
        salt = str(random.getrandbits(128)).encode('utf-8')
        email = user.email.encode('utf-8')
        user.activation_key = hashlib.sha1(salt + email).hexdigest()
        user.save()

    def perform_create(self, serializer):
        return serializer.save()

    def send_verify_link(self, user):
        """Send an email with a link to activate your profile"""
        verify_link = reverse('verify', args=[user.username, user.email, user.activation_key])
        subject = f'To activate the {user.username} account follow the link'
        message = f'To verify the {user.username} account on the portal \n {settings.DOMAIN_NAME}{verify_link}'
        return send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)

    def verify(self, username, email, activation_key):
        """Check that the key in the link matches the key in the database and 48 hours have not passed"""
        status = 'ok'
        description = str()
        user = User.objects.get(email=email, username=username)
        if user and user.activation_key == activation_key and not user.is_activation_key_expired():
            user.activation_key = ''
            user.activation_key_created = None
            user.is_active = True
            user.save()
        else:
            status = 'error'
            description = 'activation key is not valid'
        auth.login(self, user, backend='django.contrib.auth.backends.ModelBackend')

        return JsonResponse({'status': status, 'description': description})

