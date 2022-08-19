import os
from pathlib import Path

from django.core.management import BaseCommand

from PhotoNotes.settings import BASE_DIR

VENV_EXCLUDE_PATH = os.environ['VIRTUAL_ENV']
MIGRATION_PART_FILE_NAME = '_initial.py'
DB_PATH = Path(os.path.join(BASE_DIR, 'db.sqlite3'))

class Command(BaseCommand):
    def handle(self, *args, **options):

        if DB_PATH.is_file():
            os.remove(DB_PATH)
            print(f'File was delete: {DB_PATH}')

        for dirpath, dirnames, filenames in os.walk(BASE_DIR):
            for filename in [f for f in filenames if f.endswith(MIGRATION_PART_FILE_NAME)]:

                if VENV_EXCLUDE_PATH not in dirpath:
                    file_path = Path(os.path.join(dirpath, filename))
                    if file_path.is_file():
                        os.remove(file_path)
                        print(f'File was delete: {file_path}')