from rest_framework import serializers
from rest_framework.relations import SlugRelatedField
from rest_framework.serializers import ModelSerializer

from comments.models import Comments


class RecursiveField(serializers.Serializer):

    def to_representation(self, value):
        return CommentModelSerializer(value, context=self.context).data


class CommentModelSerializer(ModelSerializer):
    children = RecursiveField(many=True, read_only=True)
    user = SlugRelatedField(slug_field='username', read_only=True)
    note_owner = serializers.SerializerMethodField(source='get_note_owner')

    class Meta:
        model = Comments
        fields = ('id', 'created', 'body', 'note', 'user', 'anon_username', 'note_owner', 'parent', 'children')

    def get_note_owner(self, obj):
        return obj.note.user.username
