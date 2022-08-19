from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer

from notes.models import PhotoNotes


class PhotoNoteModelSerializer(HyperlinkedModelSerializer):

    image_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = PhotoNotes
        fields = ('id', 'created', 'title', 'image', 'image_url', 'photo_comment', 'use_on_index')

    def get_image_url(self, obj):
        return obj.image.url