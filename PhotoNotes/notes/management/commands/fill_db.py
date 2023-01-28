import json
import os
from pathlib import Path

from PIL import Image
from django.core.management import BaseCommand

from PhotoNotes import settings
from carousel.models import Carousel
from comments.models import Comments
from notes.management.commands.alter_sequence import alter_sequence

from notes.models import PhotoNotes, PhotoNotesTags
from users.models import User

JSON_PATH_NOTES = 'notes/fixtures/'
JSON_PATH_COMMENTS = 'comments/fixtures/'
JSON_PATH_CAROUSEL = 'carousel/fixtures/'


def load_from_json(file_name):
    with open(file_name, mode='r', encoding='utf-8') as infile:
        return json.load(infile)


def crop_image(image_path):
    image_file = Path(image_path)
    image = Image.open(image_file.absolute())

    width, height = image.size  # Get dimensions
    new_width = 600
    new_height = 600

    left = (width - new_width) / 2
    top = (height - new_height) / 2
    right = (width + new_width) / 2
    bottom = (height + new_height) / 2

    area = (left, top, right, bottom)

    img = image.crop(area)
    new_img = os.path.join(os.path.dirname(image_file), image_file.stem + '_crop' + image_file.suffix)
    new_img_path = Path(new_img)
    img.save(new_img_path.absolute())
    print(new_img_path.parent.name + '/' + new_img_path.name)
    return new_img_path.parent.name + '/' + new_img_path.name


class Command(BaseCommand):
    def handle(self, *args, **options):

        need_alter_sequence = True if 'postgresql' in settings.DATABASES['default']['ENGINE'] else False
        print(f'photo_notes need_alter_sequence: {need_alter_sequence}')

        photo_notes = load_from_json(JSON_PATH_NOTES + 'notes.json')
        PhotoNotes.objects.all().delete()

        for p in photo_notes:
            ph_n = {}
            ph_n['id'] = p.get('id')
            ph_n['title'] = p.get('title')
            ph_n['image'] = p.get('image')
            ph_n['pinned'] = p.get('pinned')
            ph_n['imageminicard'] = crop_image(os.path.join('media', p.get('image')))
            ph_n['photo_comment'] = p.get('photo_comment')
            ph_n['user'] = User.objects.get(pk=p.get('user'))
            new_photo_notes = PhotoNotes(**ph_n)
            new_photo_notes.save()

        last_id = len(photo_notes)
        print(f'photo_notes last_id: {last_id}')
        if need_alter_sequence:
            alter_sequence('notes_photonotes_id_seq', last_id)

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
            tag_n['note'] = PhotoNotes.objects.get(pk=tag.get('note_id'))
            tag_n['value'] = tag.get('value')
            new_tag = PhotoNotesTags(**tag_n)
            new_tag.save()

        Comments.objects.all().delete()

        note = PhotoNotes.objects.get(pk=1)

        get_user = lambda user_id: User.objects.get(pk=user_id)

        root = Comments.objects.create(body='Hi! Good photo!', user=get_user(3), note=note)
        node1 = Comments.objects.create(body='Thanks!', user=get_user(2), note=note, parent=root)
        node2 = Comments.objects.create(body='How are you?', user=get_user(3), note=note, parent=node1)
        node3 = Comments.objects.create(body='Everything is fine', user=get_user(2), note=note, parent=node2)
        Comments.objects.create(body='Whats up dude?', user=get_user(3), note=note, parent=node3)

        Comments.objects.create(body='Good!', user=get_user(2), note=note)
        Comments.objects.create(body='This is wonderful', user=get_user(3), note=note)
        Comments.objects.create(body='Incredible', user=get_user(2), note=note)
        Comments.objects.create(body='Shit', user=get_user(3), note=note)
