from collections import OrderedDict

from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from notes.models import PhotoNotesTags


class CustomPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    # max_page_size = 10
    page_query_param = 'p'

    def get_paginated_response(self, data):

        tags = PhotoNotesTags.objects.all().values('value').annotate(total=Count('value')).order_by('total')
        paginator = {
            'count': self.page.paginator.count,
            'next': self.page.next_page_number() if self.page.has_next() else None,
            'previous': self.page.previous_page_number() if self.page.has_previous() else None,
            'active_page': self.page.number
        }

        return Response(OrderedDict([
            ('paginator', paginator),
            ('tags', tags),
            ('results', data)
        ]))
