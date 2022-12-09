# Create your views here.
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from notes.models import PhotoNotes
from notes.paginations import CustomPagination
from notes.serializers import PhotoNoteModelSerializer


class PhotoNoteViewSet(ModelViewSet):
    queryset = PhotoNotes.objects.all().order_by('-modified')
    serializer_class = PhotoNoteModelSerializer
    pagination_class = CustomPagination

    # def list(self, request, *args, **kwargs):
    #     serializer = PhotoNoteModelSerializer(self.get_queryset(), context={"request": request}, many=True)
    #     return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """
        Filter queryset by url params
        http://127.0.0.1:8080/api/notes/?tags=sunrise
        :return: queryset
        """
        queryset = PhotoNotes.objects.all().order_by('-modified')
        tag = self.request.query_params.get('tags')
        if tag is not None:
            queryset = queryset.filter(tags__value=tag)
        return queryset
