from rest_framework.serializers import ModelSerializer, ModelSerializer

from users.models import User, UserProfile


class UserModelSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileModelSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('user', 'image', 'info')
