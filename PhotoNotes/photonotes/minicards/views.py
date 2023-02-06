from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet

from minicards.serializers import MiniCardsSerializer
from notes.models import PhotoNotes


class MiniCardsViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all().order_by('-modified')
    serializer_class = MiniCardsSerializer
    http_method_names = ['get', 'head']

    def get_queryset(self):
        queryset = PhotoNotes.objects.all().order_by('-modified')

        if len(queryset) > 4:
            queryset = queryset[:4]

        return queryset
