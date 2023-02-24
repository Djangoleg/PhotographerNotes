from django.conf import settings
from django.core.cache import cache

# Create your views here.
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from minicards.serializers import MiniCardsSerializer
from notes.models import PhotoNotes


class MiniCardsViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all().order_by('-created')
    serializer_class = MiniCardsSerializer
    http_method_names = ['get', 'head']

    def list(self, request, *args, **kwargs):
        if settings.LOW_CACHE:
            data = cache.get(settings.CACHE_NOTES_KEY)
            if not data:
                data = self.filter_queryset(self.get_queryset())
                cache.set(settings.CACHE_NOTES_KEY, data, settings.CACHE_NOTES_TIME)
        else:
            data = self.filter_queryset(self.get_queryset())

        if len(data) > 4:
            data = data[:4]

        page = self.paginate_queryset(data)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)
