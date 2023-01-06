# Create your views here.
from rest_framework.viewsets import ModelViewSet

from notes.models import PhotoNotes
from notes.paginations import CustomPagination
from notes.serializers import PhotoNoteModelSerializer


class PhotoNoteViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all().order_by('-pinned', '-created')
    serializer_class = PhotoNoteModelSerializer
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        request_user = self.request.user
        note = PhotoNotes.objects.get(pk=serializer.instance.pk)
        if request_user.pk != note.user.pk:
            raise Exception('Editing other notes is prohibited!')
        serializer.save(user=request_user)

    def perform_destroy(self, instance):
        request_user = self.request.user
        note = PhotoNotes.objects.get(pk=instance.pk)
        if request_user.pk != note.user.pk:
            raise Exception('Destroy other notes is prohibited!')
        instance.delete()

    def get_queryset(self):
        """
        Filter queryset by url params
        http://127.0.0.1:8080/api/notes/?tags=sunrise
        :return: queryset
        """
        queryset = PhotoNotes.objects.all().order_by('-pinned', '-created')

        note_id = self.request.query_params.get('note_id')
        if note_id is not None:
            return queryset.filter(pk=note_id)

        tag = self.request.query_params.get('tags')
        if tag is not None:
            return queryset.filter(tags__value=tag)

        return queryset
