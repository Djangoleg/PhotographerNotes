import json

from django.core.management import BaseCommand

from notes.models import PhotoNotes
from users.models import User

JSON_PATH_NOTES = 'notes/fixtures/'
JSON_PATH_COMMENTS = 'comments/fixtures/'


def load_from_json(file_name):
    with open(file_name, mode='r', encoding='utf-8') as infile:
        return json.load(infile)

class Command(BaseCommand):
    def handle(self, *args, **options):

        photo_notes = load_from_json(JSON_PATH_NOTES + 'notes.json')
        PhotoNotes.objects.all().delete()

        for p in photo_notes:
            ph_n = {}
            ph_n['title'] = p.get('title')
            ph_n['image'] = p.get('image')
            ph_n['use_on_index'] = p.get('use_on_index')
            ph_n['photo_comment'] = p.get('photo_comment')
            ph_n['user'] = User.objects.get(pk=p.get('user'))
            new_photo_notes = PhotoNotes(**ph_n)
            new_photo_notes.save()
