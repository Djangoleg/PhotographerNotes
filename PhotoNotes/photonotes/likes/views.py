from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from likes.models import PhotoNotesLikes
from likes.serializers import PhotoNoteLikesModelSerializer


class PhotoNoteLikesViewSet(ModelViewSet):
    queryset = PhotoNotesLikes.objects.all()
    serializer_class = PhotoNoteLikesModelSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        headers = self.get_success_headers(serializer.data)

        request_user = None if request.user.is_anonymous else request.user

        if request_user:
            like = self.perform_create(serializer)
            likes = PhotoNotesLikes.objects.filter(note=like.note, user=request_user)
            if len(likes) == 0:
                like.user = request_user
                like.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                return Response(serializer.data, status=status.HTTP_304_NOT_MODIFIED, headers=headers)
        else:
            return Response(serializer.data, status=status.HTTP_304_NOT_MODIFIED, headers=headers)
