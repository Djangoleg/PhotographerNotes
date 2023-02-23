from rest_framework.serializers import ModelSerializer

from notes.models import PhotoNotes


class MiniCardsSerializer(ModelSerializer):
    class Meta:
        model = PhotoNotes
        fields = ('id', 'created', 'title', 'imageminicard')
