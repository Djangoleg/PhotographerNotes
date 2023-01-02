import hashlib
import random

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
        users = User.objects.filter(email=email)

        if len(users) == 1:
            user = users.first()
            validated_data['user'] = user

        validated_data['status'] = Status.WAITING
        validated_data['hash_key'] = get_hash_key(email)

        return PwdActions.objects.create(**validated_data)
