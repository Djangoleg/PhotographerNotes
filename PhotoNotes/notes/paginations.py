from collections import OrderedDict

from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from notes.models import PhotoNotesTags, PhotoNotes


class CustomPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 10
    page_query_param = 'p'

    def get_paginated_response(self, data):

        tags = PhotoNotesTags.objects.all().values('value').annotate(total=Count('value')).order_by('total')

        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('tags', tags),
            ('results', data)
        ]))
