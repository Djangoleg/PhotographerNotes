from rest_framework import serializers
from rest_framework.relations import StringRelatedField
from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer
from rest_framework.utils import json

from comments.models import Comments
from notes.models import PhotoNotes, PhotoNotesTags


class PhotoNoteModelSerializer(ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')
    tags = StringRelatedField(many=True, read_only=True)
    comments_number = serializers.SerializerMethodField(source='get_comments_number')

    class Meta:
        model = PhotoNotes
        fields = ('id', 'modified', 'title', 'image', 'image_url', 'photo_comment', 'tags', 'comments_number')

    def get_comments_number(self, obj):
        return Comments.objects.filter(note=obj).count()

    def get_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url)

    def create(self, validated_data):
        request = self.context.get('request')
        tags_data = json.loads(request.data.get('tags'))
        note = PhotoNotes.objects.create(**validated_data)
        for tag in tags_data:
            PhotoNotesTags.objects.create(note=note, value=tag)
        return note

    def update(self, instance, validated_data):
        request = self.context.get('request')
        tags_data = json.loads(request.data.get('tags'))
        instance.title = validated_data.get('title', instance.title)
        instance.image = validated_data.get('image', instance.image)
        instance.photo_comment = validated_data.get('photo_comment', instance.photo_comment)
        instance.save()
        PhotoNotesTags.objects.filter(note_id=instance.id).delete()
        for tag in tags_data:
            PhotoNotesTags.objects.create(note_id=instance.id, value=tag)
        return instance
