from django.shortcuts import render

# Create your views here.
# CommentViewSet
from mptt.templatetags.mptt_tags import cache_tree_children
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from comments.models import Comments
from comments.serializers import CommentModelSerializer


class CommentViewSet(ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentModelSerializer

    def perform_create(self, serializer):
        if self.request.user.is_anonymous:
            return serializer.save()
        else:
            return serializer.save(user=self.request.user)

    def list(self, request):
        note_id = self.request.query_params.get('note_id')
        if note_id:
            tree = cache_tree_children(Comments.objects.filter(level=0, note_id=note_id))
        else:
            tree = cache_tree_children(Comments.objects.filter(level=0))
        serializer = CommentModelSerializer(tree, many=True)
        return Response(serializer.data)
