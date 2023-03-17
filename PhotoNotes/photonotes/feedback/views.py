# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from PhotoNotes import settings
from feedback.models import Feedback
from feedback.serializers import FeedbackModelSerializer
from messenger.message_sender import MessageSender
from messenger.models import SenderType


def send_feedback(feedback):
    """Send feedback to admin"""
    params = {'subject': feedback.title, 'recipient_list': [settings.EMAIL_HOST_USER]}

    if feedback.user:
        body = f'Email: {feedback.user.email}\nCommunication: {feedback.communication}\n{feedback.body}'
        params['user_pk'] = feedback.user.pk
    else:
        body = f'Communication: {feedback.communication}\n{feedback.body}'

    params['body'] = body
    message_sender = MessageSender(sender_type=SenderType.EMAIL, params=params)
    return message_sender.send()


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
        feedback.message = send_feedback(feedback)
        feedback.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
