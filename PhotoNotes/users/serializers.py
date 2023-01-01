from rest_framework.serializers import ModelSerializer

from users.models import User, UserProfile


class UserModelSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserModelForProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')


class UserProfileModelSerializer(ModelSerializer):
    user = UserModelForProfileSerializer(many=False, read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'image', 'info')

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = validated_data.get('user')
        user.first_name = request.data.get('firstname', user.first_name)
        user.last_name = request.data.get('lastname', user.last_name)
        user.save()
        instance.user = user
        instance.image = validated_data.get('image', instance.image)
        instance.info = validated_data.get('info', instance.info)
        instance.save()
        return instance
