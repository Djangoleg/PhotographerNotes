import hashlib
import random
from collections import OrderedDict

from django.core.cache import cache
from django.http import JsonResponse

# Create your views here.
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.viewsets import ModelViewSet

from PhotoNotes import settings
from PhotoNotes.settings import ALLOW_REGISTRATION_NEW_USERS
from messenger.message_sender import MessageSender
from messenger.models import SenderType
from users.models import User, UserProfile
from users.serializers import UserModelSerializer, UserProfileModelSerializer
from rest_framework.authtoken.models import Token


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
    http_method_names = ['post', 'head', 'delete']

    def create(self, request, *args, **kwargs):

        if not ALLOW_REGISTRATION_NEW_USERS:
            return Response(OrderedDict([
                ('is_forbidden', True),
                ('message', 'Registration of new users is prohibited'),
            ]), status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)

        Token.objects.create(user=user)

        UserProfile.objects.create(user=user)

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

    def perform_destroy(self, instance):
        if self.request.user.is_anonymous:
            raise Exception('Destroy user is prohibited!')
        if self.request.user.pk != instance.pk:
            raise Exception('Destroy user is prohibited!')
        if settings.LOW_CACHE:
            cache.delete(settings.CACHE_MINICARDS_NOTES_KEY)
        instance.delete()

    def send_verify_link(self, user):
        """Send an email with a link to activate your profile"""
        verify_link = reverse('verify', args=[user.username, user.activation_key])
        subject = f'To activate the {user.username} account follow the link'
        message = f'To verify the {user.username} account on the portal \n {settings.DOMAIN_NAME}{verify_link}'

        message_sender = MessageSender(sender_type=SenderType.EMAIL, params={'subject': subject,
                                                                             'body': message,
                                                                             'recipient_list': [user.email],
                                                                             'user_pk': user.pk})
        return message_sender.send()

    def verify(self, username, activation_key):
        """Check that the key in the link matches the key in the database and 48 hours have not passed"""
        status = 'ok'
        description = str()
        try:
            users = User.objects.filter(username=username, activation_key=activation_key)
            if len(users) > 0:
                user = users.first()
                if user and not user.is_activation_key_expired():
                    user.activation_key = ''
                    user.activation_key_created = None
                    user.is_active = True
                    user.save()
                else:
                    status = 'error'
                    description = 'activation key is not valid'
            else:
                status = 'error'
                description = 'activation key is not valid'
        except Exception:
            status = 'error'
            description = 'activation key is not valid'
        finally:
            return JsonResponse({'status': status, 'description': description})


class UserProfileViewSet(ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileModelSerializer

    def perform_update(self, serializer):
        request_user = self.request.user
        profile = UserProfile.objects.get(pk=serializer.instance.pk)
        if request_user.pk != profile.user.pk:
            raise Exception('Editing other profile is prohibited!')
        serializer.save(user=request_user)

    def get_queryset(self):
        queryset = UserProfile.objects.all()
        profile_id = self.request.query_params.get('id')
        if profile_id is not None:
            return queryset.filter(pk=profile_id)

        return queryset


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        profile = UserProfile.objects.get(user=user)

        return Response({
            'token': token.key,
            'profile_id': profile.pk,
            'user_id': user.pk,
            'firstname': user.first_name
        })
