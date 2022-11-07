# Create your views here.
from rest_framework.viewsets import ModelViewSet

from notes.models import PhotoNotes
from notes.serializers import PhotoNoteModelSerializer


class PhotoNoteViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all()

    def get_serializer_class(self):
        return PhotoNoteModelSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
