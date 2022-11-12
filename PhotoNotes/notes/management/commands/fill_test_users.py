from django.core.management import BaseCommand

from PhotoNotes.settings import UserRole
from notes.management.commands.fill_db import load_from_json
from users.models import User, Role

JSON_PATH_USERS = 'users/fixtures/'


class Command(BaseCommand):
    user_pk = 0
    ROLES_MAP = {
        'owner': UserRole.OWNER,
        'reader': UserRole.READER
    }

    def create_user(self, role):
        self.user_pk += 1
        print(f'Создан пользователь {role}_{self.user_pk}\tПароль {self.user_pk}')
        user = User.objects.create_user(pk=self.user_pk, username=f'{role}_{self.user_pk}',
                                        email=f'{self.user_pk}@mail.ru', password=f'{self.user_pk}',
                                        first_name=f'first_name_{self.user_pk}', last_name=f'last_name_{self.user_pk}',
                                        role_id=self.ROLES_MAP[role])

        user.save()
        return self.user_pk

    def handle(self, *args, **options):
        User.objects.all().delete()
        Role.objects.all().delete()

        superuser = User.objects.create_superuser('ok', 'test@gmail.com', 'KJH1212sdfg', pk=1)
        superuser.save()
        self.user_pk = 1

        # Добавление ролей пользователей
        roles = load_from_json(JSON_PATH_USERS + 'roles.json')

        for role in roles:
            new_role = Role(pk=role['pk'],
                            role_name=role['role_name'])
            new_role.save()
            print(f'роль "{new_role}" была добавлена')

        self.create_user('owner')
        self.create_user('reader')

