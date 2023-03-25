from collections import OrderedDict

from django.db.models import Count, Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from notes.models import PhotoNotesTags
from notes.models import PhotoNotes


class CustomPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    # max_page_size = 10
    page_query_param = 'p'

    def get_paginated_response(self, data):
        if self.request.user.is_anonymous:
            tags = PhotoNotesTags.objects.filter(Q(note__is_private=False)).\
                values('value').annotate(total=Count('value')).order_by('total')
        else:
            tags = PhotoNotesTags.objects.filter(Q(note__is_private=False) |
                                                 Q(note__is_private=True, note__user=self.request.user)). \
                values('value').annotate(total=Count('value')).order_by('total')

        users = PhotoNotes.objects.all().values('user__username').annotate(total=Count('id')).order_by('user__username')
        paginator = {
            'count': self.page.paginator.count,
            'next': self.page.next_page_number() if self.page.has_next() else None,
            'previous': self.page.previous_page_number() if self.page.has_previous() else None,
            'active_page': self.page.number
        }

        return Response(OrderedDict([
            ('paginator', paginator),
            ('tags', tags),
            ('user_notes', users),
            ('results', data)
        ]))
