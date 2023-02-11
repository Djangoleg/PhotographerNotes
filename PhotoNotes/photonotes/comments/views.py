from collections import OrderedDict

# Create your views here.
# CommentViewSet
from mptt.templatetags.mptt_tags import cache_tree_children
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from PhotoNotes.settings import ALLOW_ANONYMOUS_COMMENTS
from comments.models import Comments
from comments.serializers import CommentModelSerializer


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class CommentViewSet(ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentModelSerializer

    def list(self, request):
        note_id = self.request.query_params.get('note_id')
        if note_id:
            tree = cache_tree_children(Comments.objects.filter(level=0, note_id=note_id).order_by('-created'))
            count = Comments.objects.filter(note_id=note_id).count()
        else:
            tree = cache_tree_children(Comments.objects.filter(level=0).order_by('-created'))
            count = Comments.objects.all().count()

        serializer = CommentModelSerializer(tree, many=True)

        return Response(OrderedDict([
            ('count', count),
            ('results', serializer.data)
        ]))

    def create(self, request, *args, **kwargs):
        print(f'Client IP: {get_client_ip(request)}')
        if not ALLOW_ANONYMOUS_COMMENTS and request.user.is_anonymous:
            return Response(OrderedDict([
                ('is_forbidden', True),
                ('message', 'Anonymous comments are not allowed! Log in please.'),
            ]), status=status.HTTP_200_OK)

        return super(CommentViewSet, self).create(request, *args, **kwargs)

    def perform_destroy(self, instance):
        request_user = self.request.user
        if request_user.pk != instance.note.user.pk:
            raise Exception('Destroy other comment is prohibited!')
        instance.delete()
