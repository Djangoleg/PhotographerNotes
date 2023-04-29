from rest_framework import serializers
from rest_framework.relations import SlugRelatedField
from rest_framework.serializers import ModelSerializer

from comments.models import Comments
from users.models import UserProfile


class RecursiveField(serializers.Serializer):

    def to_representation(self, value):
        return CommentModelSerializer(value, context=self.context).data


class CommentModelSerializer(ModelSerializer):
    children = RecursiveField(many=True, read_only=True)
    user = SlugRelatedField(slug_field='username', read_only=True)
    note_owner = serializers.SerializerMethodField(source='get_note_owner', read_only=True)
    profile_pk = serializers.SerializerMethodField(source='get_profile_pk', read_only=True)

    class Meta:
        model = Comments
        fields = ('id', 'created', 'body', 'note', 'user', 'profile_pk', 'anon_username',
                  'note_owner', 'parent', 'children',)

    def get_note_owner(self, obj):
        return obj.note.user.username

    def get_profile_pk(self, obj):
        return UserProfile.objects.get(user=obj.user).pk if obj.user else None
