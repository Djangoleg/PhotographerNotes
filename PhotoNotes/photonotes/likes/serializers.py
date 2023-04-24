from rest_framework.serializers import ModelSerializer

from likes.models import PhotoNotesLikes


class PhotoNoteLikesModelSerializer(ModelSerializer):
    class Meta:
        model = PhotoNotesLikes
        fields = ('note',)
