from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from carousel.models import Carousel
from carousel.serializers import CarouselModelSerializer


class CarouselViewSet(ModelViewSet):
    queryset = Carousel.objects.filter(is_active=True).order_by('priority')
    http_method_names = ['get', 'head']

    def get(self, request):
        serializer = CarouselModelSerializer(self.queryset, context={"request": request}, many=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        return CarouselModelSerializer
