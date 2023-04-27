from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from likes.models import PhotoNotesLikes
from likes.serializers import PhotoNoteLikesModelSerializer
from notes.models import PhotoNotes


class PhotoNoteLikesViewSet(ModelViewSet):
    queryset = PhotoNotesLikes.objects.all()
    serializer_class = PhotoNoteLikesModelSerializer
    http_method_names = ['post', 'head']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        headers = self.get_success_headers(serializer.data)

        request_user = None if request.user.is_anonymous else request.user

        if request_user:
            note = PhotoNotes.objects.get(pk=serializer.data['note'])
            likes = PhotoNotesLikes.objects.filter(note=note, user=request_user)
            if len(likes) == 0:
                PhotoNotesLikes.objects.create(note=note, user=request_user)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                PhotoNotesLikes.objects.filter(note=note, user=request_user).delete()
                return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
        else:
            return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED, headers=headers)
