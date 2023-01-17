import os
from io import BytesIO
from PIL import Image, ImageOps
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers
from rest_framework.relations import StringRelatedField
from rest_framework.serializers import ModelSerializer
from rest_framework.utils import json

from PhotoNotes.settings import MAX_IMAGE_SIZE, MAX_MINICARD_SIZE
from comments.models import Comments
from notes.models import PhotoNotes, PhotoNotesTags
from users.models import User, UserProfile


class PhotoNoteModelSerializer(ModelSerializer):
    tags = StringRelatedField(many=True, read_only=True)
    comments_number = serializers.SerializerMethodField(source='get_comments_number', read_only=True)
    username = serializers.SerializerMethodField(source='get_username', read_only=True)
    user_firstname = serializers.SerializerMethodField(source='get_user_firstname', read_only=True)
    profile_id = serializers.SerializerMethodField(source='get_profile_id', read_only=True)

    class Meta:
        model = PhotoNotes
        fields = ('id', 'modified', 'username', 'user_firstname', 'profile_id', 'title', 'image', 'photo_comment',
                  'tags', 'comments_number', 'pinned')

    def get_profile_id(self, obj):
        return UserProfile.objects.get(user=obj.user).pk

    def get_username(self, obj):
        return User.objects.get(pk=obj.user.pk).username

    def get_user_firstname(self, obj):
        return User.objects.get(pk=obj.user.pk).first_name

    def get_comments_number(self, obj):
        return Comments.objects.filter(note=obj).count()

    def create(self, validated_data):
        request = self.context.get('request')
        tags_data = json.loads(request.data.get('tags'))

        image = validated_data.pop('image')
        file_content = ContentFile(image.read())
        image.image.close()
        image_name = os.path.split(image.name)[1]

        validated_data['imageminicard'] = self.crop_image(file_content, image_name, image.content_type)

        resize_image = self.resize_image(file_content, image_name, image.content_type)
        validated_data['image'] = resize_image if resize_image else image

        note = PhotoNotes.objects.create(**validated_data)
        for tag in tags_data:
            PhotoNotesTags.objects.create(note=note, value=tag)
        return note

    def update(self, instance, validated_data):
        request = self.context.get('request')
        tags_data = json.loads(request.data.get('tags'))
        instance.title = validated_data.get('title', instance.title)
        image = validated_data.get('image', instance.image)
        instance.image = image
        if not image.closed:
            instance.imageminicard = self.crop_image(image)
        instance.photo_comment = validated_data.get('photo_comment', instance.photo_comment)
        instance.pinned = validated_data.get('pinned', instance.pinned)
        instance.save()
        PhotoNotesTags.objects.filter(note_id=instance.id).delete()
        for tag in tags_data:
            PhotoNotesTags.objects.create(note_id=instance.id, value=tag)
        return instance

    def resize_image(self, file_content, image_name, content_type):
        target_image = Image.open(file_content)
        target_image = ImageOps.exif_transpose(target_image)
        width, height = target_image.size
        size = (MAX_IMAGE_SIZE, MAX_IMAGE_SIZE)

        if width > MAX_IMAGE_SIZE or height > MAX_IMAGE_SIZE:
            target_image.thumbnail(size, resample=Image.ANTIALIAS)
            buffer = BytesIO()
            target_image.save(buffer, format="JPEG")

            new_picture_file = InMemoryUploadedFile(file=buffer, field_name='imageminicard', name=image_name,
                                                    content_type=content_type, size=len(buffer.getvalue()),
                                                    charset=None)
            return new_picture_file
        else:
            return None

    def crop_image(self, file_content, image_name, content_type):
        target_image = Image.open(file_content)
        target_image = ImageOps.exif_transpose(target_image)

        width, height = target_image.size  # Get dimensions
        new_width = MAX_MINICARD_SIZE
        new_height = MAX_MINICARD_SIZE

        left = (width - new_width) / 2
        top = (height - new_height) / 2
        right = (width + new_width) / 2
        bottom = (height + new_height) / 2

        area = (left, top, right, bottom)

        temp_file = target_image.crop(area)
        buffer = BytesIO()
        temp_file.save(buffer, format="JPEG")

        new_picture_filename = 'crop_' + image_name

        new_picture_file = InMemoryUploadedFile(file=buffer, field_name='imageminicard', name=new_picture_filename,
                                                content_type=content_type, size=len(buffer.getvalue()),
                                                charset=None)

        return new_picture_file
