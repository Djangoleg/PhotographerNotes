# Create your views here.
from django.core.cache import cache
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from PhotoNotes import settings
from notes.models import PhotoNotes
from notes.paginations import CustomPagination
from notes.serializers import PhotoNoteModelSerializer


class PhotoNoteViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all().order_by('-is_pinned', '-created')
    serializer_class = PhotoNoteModelSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = self.queryset

        if self.request.user.is_anonymous:
            queryset = queryset.filter(is_private=False)
        else:
            queryset = queryset.filter(Q(is_private=False) | Q(is_private=True, user=self.request.user))

        return queryset

    def perform_create(self, serializer):
        if settings.LOW_CACHE:
            # cache.delete(settings.CACHE_NOTES_KEY)
            cache.delete(settings.CACHE_MINICARDS_NOTES_KEY)
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if settings.LOW_CACHE:
            # cache.delete(settings.CACHE_NOTES_KEY)
            cache.delete(settings.CACHE_MINICARDS_NOTES_KEY)
        request_user = self.request.user
        note = PhotoNotes.objects.get(pk=serializer.instance.pk)
        if request_user.pk != note.user.pk:
            raise Exception('Editing other notes is prohibited!')
        serializer.save(user=request_user)

    def perform_destroy(self, instance):
        if settings.LOW_CACHE:
            # cache.delete(settings.CACHE_NOTES_KEY)
            cache.delete(settings.CACHE_MINICARDS_NOTES_KEY)
        request_user = self.request.user
        note = PhotoNotes.objects.get(pk=instance.pk)
        if request_user.pk != note.user.pk:
            raise Exception('Destroy other notes is prohibited!')
        instance.delete()

    def list(self, request, *args, **kwargs):
        # if settings.LOW_CACHE:
        #     data = cache.get(settings.CACHE_NOTES_KEY)
        #
        #     if not data:
        #         data = self.filter_queryset(self.get_queryset())
        #         cache.set(settings.CACHE_NOTES_KEY, data, settings.CACHE_NOTES_TIME)
        # else:
        #     data = self.filter_queryset(self.get_queryset())

        data = self.filter_queryset(self.get_queryset())

        note_id = request.query_params.get('note_id')
        username = request.query_params.get('user')
        tag = request.query_params.get('tags')

        if note_id is not None:
            data = data.filter(pk=note_id)
        elif username is not None:
            data = data.filter(user__username=username)
        elif tag is not None:
            data = data.filter(tags__value=tag)

        page = self.paginate_queryset(data)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)
