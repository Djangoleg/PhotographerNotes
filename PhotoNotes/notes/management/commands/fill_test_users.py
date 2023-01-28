from django.core.management import BaseCommand

from PhotoNotes import settings
from notes.management.commands.alter_sequence import alter_sequence
from users.models import User, UserProfile
from rest_framework.authtoken.models import Token

JSON_PATH_USERS = 'users/fixtures/'


class Command(BaseCommand):
    user_pk = 0

    def create_user(self, username, firstname, lastname):
        self.user_pk += 1
        print(f'Created user: {username}\tPass: Ghjkhsd124{self.user_pk}')
        user = User.objects.create_user(pk=self.user_pk, username=username,
                                        email=f'{self.user_pk}@mail.ru', password=f'Ghjkhsd124{self.user_pk}',
                                        first_name=firstname, last_name=lastname)
        Token.objects.create(user=user)

        user.save()
        return user

    def handle(self, *args, **options):
        need_alter_sequence = True if 'postgresql' in settings.DATABASES['default']['ENGINE'] else False
        print(f'users need_alter_sequence: {need_alter_sequence}')

        UserProfile.objects.all().delete()
        User.objects.all().delete()

        superuser = User.objects.create_superuser(pk=1, username='ok', first_name='William', last_name='Authenticator',
                                                  email='test@gmail.com', password='KJH1212sdfg')
        Token.objects.create(user=superuser)
        superuser.save()
        self.user_pk = 1
        UserProfile.objects.create(user=superuser, image="user_pics/1.jpg", info="I love pictures and photography")

        billy = self.create_user('billy', 'Billy', 'Bonce')
        UserProfile.objects.create(user=billy, image="user_pics/2.jpg", info="I not love pictures and photography")

        johny = self.create_user('johny', 'Johny', 'Dre')
        UserProfile.objects.create(user=johny, image="user_pics/3.jpg", info="I love photography")

        print(f'photo_notes last_id: {self.user_pk}')
        if need_alter_sequence:
            alter_sequence('notes_photonotes_id_seq', self.user_pk + 1)
