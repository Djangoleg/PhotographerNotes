import json

from django.core.management import BaseCommand

from carousel.models import Carousel
from comments.models import Comments

from notes.models import PhotoNotes, PhotoNotesTags
from users.models import User

JSON_PATH_NOTES = 'notes/fixtures/'
JSON_PATH_COMMENTS = 'comments/fixtures/'
JSON_PATH_CAROUSEL = 'carousel/fixtures/'


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
            ph_n['photo_comment'] = p.get('photo_comment')
            ph_n['user'] = User.objects.get(pk=p.get('user'))
            new_photo_notes = PhotoNotes(**ph_n)
            new_photo_notes.save()

        photo_carousel = load_from_json(JSON_PATH_CAROUSEL + 'carousel.json')
        Carousel.objects.all().delete()

        for car in photo_carousel:
            car_n = {}
            car_n['title'] = car.get('title')
            car_n['image'] = car.get('image')
            car_n['is_active'] = car.get('is_active')
            new_photo_carousel = Carousel(**car_n)
            new_photo_carousel.save()

        tags = load_from_json(JSON_PATH_NOTES + 'tags.json')
        PhotoNotesTags.objects.all().delete()

        for tag in tags:
            tag_n = {}
            tag_n['note'] = PhotoNotes.objects.order_by('?').first()
            tag_n['value'] = tag.get('value')
            new_tag = PhotoNotesTags(**tag_n)
            new_tag.save()

        Comments.objects.all().delete()

        note = PhotoNotes.objects.order_by('pk').first()

        get_comments = lambda comments_id: Comments.objects.get(pk=comments_id)
        get_user = lambda user_id: User.objects.get(pk=user_id)

        root = Comments.objects.create(body='root 1', user=get_user(3), note=note)
        node1 = Comments.objects.create(body='child 1', user=get_user(2), note=note, parent=root)
        node2 = Comments.objects.create(body='child 2', user=get_user(3), note=note, parent=root)
        node3 = Comments.objects.create(body='child 3', user=get_user(2), note=note, parent=node2)

        root2 = Comments.objects.create(body='root 2', user=get_user(2), note=note)
        node1 = Comments.objects.create(body='child 1', user=get_user(2), note=note, parent=root2)
        node2 = Comments.objects.create(body='child 2', user=get_user(2), note=note, parent=node1)
