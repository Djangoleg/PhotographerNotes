from collections import OrderedDict

# Create your views here.
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.viewsets import ModelViewSet

from PhotoNotes import settings
from pwdsetting.models import PwdActions
from pwdsetting.serializers import PwdActionsSerializer
from users.models import UserProfile


def send_pwd_link(pwd_action):
    pwd_link = reverse('checkkey', args=[pwd_action.hash_key])
    subject, message = 'link to change your password', f'{settings.DOMAIN_NAME}{pwd_link}'
    send_mail(subject, message, settings.EMAIL_HOST_USER, [pwd_action.email], fail_silently=False)


def check_hash_key(request, hash_key):
    pwd_actions = PwdActions.objects.filter(hash_key=hash_key)
    if len(pwd_actions) == 1:
        pwd_action = pwd_actions.first()
        user = pwd_action.user
        token, created = Token.objects.get_or_create(user=user)
        profile = UserProfile.objects.get(user=user)
        return JsonResponse({
            'id': pwd_action.pk,
            'token': token.key,
            'username': user.username,
            'profile_id': profile.pk,
            'firstname': user.first_name
        })

    return JsonResponse({'message': f'Invalid key: {hash_key}'})


class PwdActionsViewSet(ModelViewSet):
    queryset = PwdActions.objects.all()
    serializer_class = PwdActionsSerializer
    http_method_names = ['post', 'head', 'put']

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pwd_action = self.perform_create(serializer)
        send_pwd_link(pwd_action)
        headers = self.get_success_headers(serializer.data)

        return Response(OrderedDict([
            ('message', f'A link to change your password has been sent to the {pwd_action.email} address provided.'),
        ]), status=status.HTTP_201_CREATED, headers=headers)
