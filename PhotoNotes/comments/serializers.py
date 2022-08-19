from rest_framework.serializers import HyperlinkedModelSerializer

from comments.models import Comments


class CommentModelSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Comments
        fields = ('id', 'created', 'body', 'photonotes', 'parent')
