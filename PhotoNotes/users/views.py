from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet

from users.models import User
from users.serializers import UserModelSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        return UserModelSerializer
