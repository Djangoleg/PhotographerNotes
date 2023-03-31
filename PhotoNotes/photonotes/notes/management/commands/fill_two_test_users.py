from django.core.management import BaseCommand

from PhotoNotes import settings
from users.models import User, UserProfile
from rest_framework.authtoken.models import Token


def create_user(pk, username, firstname, lastname):
    print(f'Created user: {username}\tPass: Ghjkhsd124{pk}')
    user = User.objects.create_user(pk=pk, username=username,
                                    email=f'{pk}@mail.ru', password=f'Ghjkhsd124{pk}',
                                    first_name=firstname, last_name=lastname)
    Token.objects.create(user=user)

    user.save()
    return user


class Command(BaseCommand):

    def handle(self, *args, **options):
        user_names = ['billy', 'johny']
        for name in user_names:
            users = User.objects.filter(username=name)
            user = None
            if len(users) > 0:
                user = users.first()
            if user:
                UserProfile.objects.filter(user=user).delete()
                User.objects.filter(pk=user.pk).delete()

        user_pks = [1000, 1001]
        UserProfile.objects.filter(pk=user_pks[0]).delete()
        UserProfile.objects.filter(pk=user_pks[1]).delete()
        User.objects.filter(pk=user_pks[0]).delete()
        User.objects.filter(pk=user_pks[1]).delete()

        billy = create_user(user_pks[0], 'billy', 'Billy', 'Bonce')
        UserProfile.objects.create(user=billy, image="user_pics/2.jpg", info="I not love pictures and photography")

        johny = create_user(user_pks[1], 'johny', 'Johny', 'Dre')
        UserProfile.objects.create(user=johny, image="user_pics/3.jpg", info="I love photography")
