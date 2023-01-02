import hashlib
import random

from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from pwd.models import PwdActions, Status
from users.models import User


def get_hash_key(email):
    salt = str(random.getrandbits(128)).encode('utf-8')
    email_encode = email.encode('utf-8')
    return hashlib.sha1(salt + email_encode).hexdigest()


class PwdActionsSerializer(ModelSerializer):
    class Meta:
        model = PwdActions
        fields = ('email',)

    def create(self, validated_data):
        email = validated_data.get('email')

        if not email:
            raise serializers.ValidationError({'email': ['This field may not be null.']})

        users = User.objects.filter(email=email)

        if len(users) == 1:
            user = users.first()
            validated_data['user'] = user

        validated_data['status'] = Status.WAITING
        validated_data['hash_key'] = get_hash_key(email)

        return PwdActions.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        password = request.data.get('password')

        if not password:
            self.set_pwd_actions_error(instance, {'password': ['This data may not be null or empty.']})

        if instance.is_hash_key_expired():
            self.set_pwd_actions_error(instance, {'hash_key': ['Hash key is expired.']})

        user = User.objects.get(pk=instance.user.pk)
        user.password = make_password(password)
        user.save()
        instance.status = Status.SUCCESS
        instance.hash_key = ''
        instance.save()
        return instance

    def set_pwd_actions_error(self, instance, error):
        instance.status = Status.ERROR
        instance.hash_key = ''
        instance.save()
        raise serializers.ValidationError(error)

