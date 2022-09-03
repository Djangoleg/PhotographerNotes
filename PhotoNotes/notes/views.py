from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet

from notes.models import PhotoNotes
from notes.serializers import PhotoNoteModelSerializer


class PhotoNoteViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all()[:3]

    def get_serializer_class(self):
        return PhotoNoteModelSerializer