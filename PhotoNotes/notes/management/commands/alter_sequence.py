from PhotoNotes import settings


def alter_sequence(sequence_name, last_id):
    try:
        dbname = settings.DATABASES['default']['NAME']
        user = settings.DATABASES['default']['USER']
        host = settings.DATABASES['default']['HOST']
        password = settings.DATABASES['default']['PASSWORD']
        port = settings.DATABASES['default']['PORT']
        connection = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
        )
        cursor = connection.cursor()
        cursor.execute(f'ALTER SEQUENCE {sequence_name} RESTART WITH {last_id};')
        connection.commit()
        connection.close()
    except Exception as e:
        print(f'alter_sequence error: {e}')

