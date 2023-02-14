from django.contrib import admin

# Register your models here.
from carousel.models import Carousel


@admin.register(Carousel)
class CourseAdmin(admin.ModelAdmin):
    pass
