from rest_framework.serializers import ModelSerializer

from feedback.models import Feedback


class FeedbackModelSerializer(ModelSerializer):

    class Meta:
        model = Feedback
        fields = ('title', 'body', 'communication')
