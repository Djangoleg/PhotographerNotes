from django.core.management import BaseCommand

from users.models import User
from rest_framework.authtoken.models import Token

JSON_PATH_USERS = 'users/fixtures/'


class Command(BaseCommand):
    user_pk = 0

    def create_user(self, name):
        self.user_pk += 1
        print(f'Created user: {name}_{self.user_pk}\tPass: Ghjkhsd124{self.user_pk}')
        user = User.objects.create_user(pk=self.user_pk, username=f'{name}_{self.user_pk}',
                                        email=f'{self.user_pk}@mail.ru', password=f'Ghjkhsd124{self.user_pk}',
                                        first_name=f'first_name_{self.user_pk}', last_name=f'last_name_{self.user_pk}')
        Token.objects.create(user=user)

        user.save()
        return self.user_pk

    def handle(self, *args, **options):
        User.objects.all().delete()

        superuser = User.objects.create_superuser('ok', 'test@gmail.com', 'KJH1212sdfg', pk=1)
        Token.objects.create(user=superuser)
        superuser.save()
        self.user_pk = 1

        self.create_user('billy')
        self.create_user('johny')
