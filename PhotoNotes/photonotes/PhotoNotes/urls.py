"""PhotoNotes URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from django.views.static import serve

from PhotoNotes import settings
from carousel.views import CarouselViewSet
from comments.views import CommentViewSet
from feedback.views import FeedbackViewSet
from minicards.views import MiniCardsViewSet
from notes.views import PhotoNoteViewSet
from pwdsetting.views import check_hash_key, PwdActionsViewSet
from users.views import UserViewSet, UserProfileViewSet, CustomAuthToken

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('profile', UserProfileViewSet)
router.register('notes', PhotoNoteViewSet)
router.register('comments', CommentViewSet)
router.register('carousel', CarouselViewSet)
router.register('feedback', FeedbackViewSet)
router.register('minicards', MiniCardsViewSet, 'minicards')
router.register('pwdsetting', PwdActionsViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
    path('api-token-auth/', CustomAuthToken.as_view()),
    path('verify/<str:username>/<str:activation_key>/', UserViewSet.verify, name='verify'),
    path('checkkey/<str:hash_key>/', check_hash_key, name='checkkey'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, }), ]
