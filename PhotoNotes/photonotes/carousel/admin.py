from django.contrib import admin

# Register your models here.
from carousel.models import Carousel


@admin.register(Carousel)
class CarouselAdmin(admin.ModelAdmin):
    list_display = ('title', 'created', 'image', 'priority', 'is_active')
