from messenger.email_sender import Email
from messenger.telegram_sender import Telegram


class SenderFactory:
    types = {
        'EMAIL': Email,
        'TELEGRAM': Telegram
    }

    @classmethod
    def create(cls, message_type, name):
        """
        Factory method.
        """
        return cls.types[message_type](name)


class MessageSender:
    def __int__(self, message_type, name):
        self.factory = SenderFactory.create(message_type, name)

    def send_message(self):
        self.factory.send()
