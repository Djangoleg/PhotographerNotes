# Create your views here.
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework.viewsets import ModelViewSet

from notes.models import PhotoNotes
from notes.serializers import PhotoNoteModelSerializer


class PhotoNoteViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all().order_by('-modified')

    def get(self, request, format=None):
        serializer = PhotoNoteModelSerializer(self.queryset, context={"request": request}, many=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        return PhotoNoteModelSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

