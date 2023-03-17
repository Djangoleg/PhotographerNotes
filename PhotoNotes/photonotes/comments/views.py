from collections import OrderedDict
from threading import Thread

from django.contrib.sites.models import Site
from mptt.templatetags.mptt_tags import cache_tree_children
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from PhotoNotes.settings import ALLOW_ANONYMOUS_COMMENTS
from comments.models import Comments
from comments.serializers import CommentModelSerializer
from messenger.message_sender import MessageSender
from messenger.models import SenderType


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


# CommentViewSet
class CommentViewSet(ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentModelSerializer

    def list(self, request, *args, **kwargs):
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

        if not ALLOW_ANONYMOUS_COMMENTS and request.user.is_anonymous:
            return Response(OrderedDict([
                ('is_forbidden', True),
                ('message', 'Anonymous comments are not allowed! Log in please.'),
            ]), status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = self.perform_create(serializer)
        comment.ip_address = get_client_ip(request)

        request_user = None if request.user.is_anonymous else request.user
        if request_user:
            comment.user = request_user
        comment.save()

        # Do not send a message if commenting to himself.
        if request_user != comment.note.user:
            params = {'recipient_list': [comment.note.user.email]}

            if request_user:
                params['user_pk'] = request_user.pk

            subject = f'A comment has been added to your entry "{comment.note.title}"'

            if comment.user:
                comment_user_name = comment.user.first_name
            else:
                comment_user_name = comment.anon_username

            message = f'{Site.objects.get_current().domain}/note/view/{comment.note.pk}\nComment ' \
                      f'from "{comment_user_name}":\n{comment.body}\n'

            params['subject'] = subject
            params['body'] = message

            message_sender = MessageSender(sender_type=SenderType.EMAIL, params=params)

            # Its work, but need to think - is this normal?
            thread = Thread(target=message_sender.send)
            thread.start()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        return serializer.save()

    def perform_destroy(self, instance):
        request_user = self.request.user
        if request_user.pk != instance.note.user.pk:
            raise Exception('Destroy other comment is prohibited!')
        instance.delete()
