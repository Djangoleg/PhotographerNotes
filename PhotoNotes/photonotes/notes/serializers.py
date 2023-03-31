import os

from PIL import Image, ImageOps
from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.relations import StringRelatedField
from rest_framework.serializers import ModelSerializer
from rest_framework.utils import json

from PhotoNotes.settings import MAX_IMAGE_SIZE, MAX_MINICARD_SIZE
from comments.models import Comments
from notes.models import PhotoNotes, PhotoNotesTags
from users.models import User, UserProfile
from notes.imagehelper import crop_to_aspect, check_and_resize_image_if_need, get_memory_upload_file, \
    get_random_file_name


class PhotoNoteModelSerializer(ModelSerializer):
    tags = StringRelatedField(many=True, read_only=True)
    comments_number = serializers.SerializerMethodField(source='get_comments_number', read_only=True)
    username = serializers.SerializerMethodField(source='get_username', read_only=True)
    user_firstname = serializers.SerializerMethodField(source='get_user_firstname', read_only=True)
    profile_id = serializers.SerializerMethodField(source='get_profile_id', read_only=True)

    class Meta:
        model = PhotoNotes
        fields = ('id', 'created', 'username', 'user_firstname', 'profile_id', 'title', 'image', 'photo_comment',
                  'tags', 'comments_number', 'is_pinned', 'is_private', 'is_hide_minicard',)

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

        raw_image = validated_data.pop('image')
        file_content = ContentFile(raw_image.read())
        raw_image.image.close()

        image_name = get_random_file_name(20, 'pn_', '.jpg')
        image_mini_card_name = f"crop_{image_name}"

        image = Image.open(file_content)
        check_and_resize_image_if_need(image, max_image_size=MAX_IMAGE_SIZE)
        trans_image = ImageOps.exif_transpose(image)
        trans_image = trans_image.convert('RGB')

        validated_data['image'] = get_memory_upload_file(trans_image, image_name, raw_image.content_type, 'image')

        check_and_resize_image_if_need(trans_image, max_image_size=MAX_MINICARD_SIZE)
        mini_card = crop_to_aspect(trans_image, MAX_MINICARD_SIZE, MAX_MINICARD_SIZE)

        validated_data['imageminicard'] = get_memory_upload_file(mini_card, image_mini_card_name,
                                                                 raw_image.content_type, 'imageminicard')

        note = PhotoNotes.objects.create(**validated_data)
        for tag in tags_data:
            PhotoNotesTags.objects.create(note=note, value=tag)
        return note

    def update(self, instance, validated_data):
        request = self.context.get('request')
        tags_data = json.loads(request.data.get('tags'))
        instance.title = validated_data.get('title', instance.title)
        raw_image = validated_data.get('image', instance.image)
        instance.image = raw_image
        if not raw_image.closed:
            file_content = ContentFile(raw_image.read())
            raw_image.image.close()

            image_name = get_random_file_name(20, 'pn_', '.jpg')
            image_mini_card_name = f"crop_{image_name}"

            image = Image.open(file_content)
            check_and_resize_image_if_need(image, max_image_size=MAX_IMAGE_SIZE)
            trans_image = ImageOps.exif_transpose(image)
            trans_image = trans_image.convert('RGB')

            instance.image = get_memory_upload_file(trans_image, image_name, raw_image.content_type, 'image')

            check_and_resize_image_if_need(trans_image, max_image_size=MAX_MINICARD_SIZE)
            mini_card = crop_to_aspect(trans_image, MAX_MINICARD_SIZE, MAX_MINICARD_SIZE)

            instance.imageminicard = get_memory_upload_file(mini_card, image_mini_card_name,
                                                            raw_image.content_type, 'imageminicard')

        instance.photo_comment = validated_data.get('photo_comment', instance.photo_comment)
        instance.is_pinned = validated_data.get('is_pinned', instance.is_pinned)
        instance.is_private = validated_data.get('is_private', instance.is_private)
        instance.is_hide_minicard = validated_data.get('is_hide_minicard', instance.is_hide_minicard)
        instance.save()
        PhotoNotesTags.objects.filter(note_id=instance.id).delete()
        for tag in tags_data:
            PhotoNotesTags.objects.create(note_id=instance.id, value=tag)
        return instance
