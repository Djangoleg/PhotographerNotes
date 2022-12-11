from django.contrib.auth.models import AnonymousUser
from django.core.mail import send_mail
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from PhotoNotes import settings
from feedback.models import Feedback
from feedback.serializers import FeedbackModelSerializer


def send_feedback(feedback):
    """Send feedback to admin"""
    subject = feedback.title

    if feedback.user:
        message = f'Email: {feedback.user.email}\nCommunication: {feedback.communication}\n{feedback.body}'
    else:
        message = f'Communication: {feedback.communication}\n{feedback.body}'

    return send_mail(subject, message, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=False)


class FeedbackViewSet(ModelViewSet):
    queryset = Feedback.objects.all().order_by('-created')
    serializer_class = FeedbackModelSerializer
    http_method_names = ['post', 'head']

    def perform_create(self, serializer):
        if self.request.user.is_anonymous:
            return serializer.save()
        else:
            return serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        feedback = self.perform_create(serializer)
        send_feedback(feedback)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
