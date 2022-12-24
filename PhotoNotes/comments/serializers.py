from rest_framework import serializers
from rest_framework.relations import SlugRelatedField
from rest_framework.serializers import ModelSerializer

from comments.models import Comments
from notes.models import PhotoNotes
from users.models import User


class UserNameRelatedField(SlugRelatedField):
    slug_field = 'username'

    def __init__(self, **kwargs):
        kwargs['read_only'] = False
        kwargs['queryset'] = User.objects.all()
        super().__init__(self.slug_field, **kwargs)

    def to_internal_value(self, value):
        user = User.objects.filter(username=value)
        if user and (len(user)) == 1:
            return user.first()
        else:
            # raise ValidationError(f"User with name: {value} not found")
            user = User.objects.create_user(username=value)
            return user


class RecursiveField(serializers.Serializer):

    def to_representation(self, value):
        return CommentModelSerializer(value, context=self.context).data


class CommentModelSerializer(ModelSerializer):
    children = RecursiveField(many=True)
    user = UserNameRelatedField()
    note_owner = serializers.SerializerMethodField(source='get_note_owner')

    class Meta:
        model = Comments
        fields = ('id', 'created', 'body', 'note', 'user', 'note_owner', 'parent', 'children')

    def get_note_owner(self, obj):
        return obj.note.user.username

    def create(self, validated_data):
        validated_data.pop('children')
        instance = Comments.objects.create(**validated_data)
        return instance
