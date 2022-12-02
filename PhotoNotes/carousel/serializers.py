from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from carousel.models import Carousel


class CarouselModelSerializer(ModelSerializer):

    image_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Carousel
        fields = ('id', 'title', 'image_url', 'is_active')

    def get_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url)
