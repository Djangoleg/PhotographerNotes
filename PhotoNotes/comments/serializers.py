from abc import ABC

from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from comments.models import Comments


class RecursiveField(serializers.Serializer):

    def to_representation(self, value):
        return CommentModelSerializer(value, context=self.context).data


class CommentModelSerializer(ModelSerializer):
    children = RecursiveField(many=True)

    def create(self, validated_data):
        validated_data.pop('children')
        instance = Comments.objects.create(**validated_data)
        return instance

    class Meta:
        model = Comments
        fields = ('id', 'created', 'body', 'note', 'user', 'parent', 'children')
