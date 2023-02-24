from PIL import Image, ImageOps
from django.core.files.base import ContentFile
from rest_framework.serializers import ModelSerializer

from PhotoNotes.settings import MAX_PROFILE_IMAGE_SIZE
from notes.imagehelper import get_random_file_name, check_and_resize_image_if_need, get_memory_upload_file
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

        raw_image = validated_data.get('image', instance.image)
        instance.image = raw_image
        if not raw_image.closed:
            file_content = ContentFile(raw_image.read())
            raw_image.image.close()

            image_name = get_random_file_name(20, 'pn_', '.jpg')

            image = Image.open(file_content)
            check_and_resize_image_if_need(image, max_image_size=MAX_PROFILE_IMAGE_SIZE)
            trans_image = ImageOps.exif_transpose(image)

            instance.image = get_memory_upload_file(trans_image, image_name, raw_image.content_type, 'image')

        instance.info = validated_data.get('info', instance.info)
        instance.save()
        return instance
