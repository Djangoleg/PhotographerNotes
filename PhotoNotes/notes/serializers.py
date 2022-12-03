from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer

from notes.models import PhotoNotes


class PhotoNoteModelSerializer(ModelSerializer):

    image_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = PhotoNotes
        fields = ('id', 'created', 'title', 'image', 'image_url', 'photo_comment')

    def get_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url)
