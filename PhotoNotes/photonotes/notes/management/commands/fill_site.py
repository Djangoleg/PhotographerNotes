from django.contrib.sites.models import Site
from django.core.management import BaseCommand


# Added to settings.py site_id depending on the stand. Ex: SITE_ID = 1
class Command(BaseCommand):
    def handle(self, *args, **options):
        Site.objects.all().delete()
        sites = [
            {'id': 1, 'name': 'dev', 'domain': 'http://localhost:3000'},
            {'id': 2, 'name': 'test', 'domain': 'https://test-mpn.tech'},
            {'id': 3, 'name': 'prod', 'domain': 'https://myphotonotes.tech'},
        ]

        for site in sites:
            pn_site = Site(**site)
            pn_site.save()
