from abc import ABC

from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from comments.models import Comments

# class UserRelatedField(StringRelatedField):
#
#     def to_internal_value(self, value):
#         user = User.objects.filter(username=value)
#         if user and (len(user)) == 1:
#             return user.get().id
#         else:
#             raise ValidationError(f"User with name: {value} not found")

class RecursiveField(serializers.Serializer):

    def to_representation(self, value):
        return CommentModelSerializer(value, context=self.context).data


class CommentModelSerializer(ModelSerializer):
    children = RecursiveField(many=True)
    # user = UserRelatedField(many=False)

    def create(self, validated_data):
        validated_data.pop('children')
        instance = Comments.objects.create(**validated_data)
        return instance

    class Meta:
        model = Comments
        fields = ('id', 'created', 'body', 'note', 'user', 'parent', 'children')


