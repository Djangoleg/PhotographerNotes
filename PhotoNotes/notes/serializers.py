from rest_framework.serializers import HyperlinkedModelSerializer

from notes.models import PhotoNotes


class PhotoNoteModelSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = PhotoNotes
        fields = ('id', 'created', 'title', 'image', 'photo_comment', 'use_on_index')