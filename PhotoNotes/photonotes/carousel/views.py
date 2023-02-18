from django.shortcuts import render

# Create your views here.
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from rest_framework.viewsets import ModelViewSet

from PhotoNotes import settings
from carousel.models import Carousel
from carousel.serializers import CarouselModelSerializer


class CarouselViewSet(ModelViewSet):
    queryset = Carousel.objects.filter(is_active=True).order_by('priority')
    http_method_names = ['get', 'head']
    serializer_class = CarouselModelSerializer

    @method_decorator(cache_page(settings.CACHE_CAROUSEL_TIME))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super(CarouselViewSet, self).list(request, *args, **kwargs)
