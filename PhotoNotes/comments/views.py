from django.shortcuts import render

# Create your views here.
# CommentViewSet
from rest_framework.viewsets import ModelViewSet

from comments.models import Comments
from comments.serializers import CommentModelSerializer


class CommentViewSet(ModelViewSet):
    queryset = Comments.objects.all()

    def get_serializer_class(self):
        return CommentModelSerializer
