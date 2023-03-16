from messenger.email_sender import Email
from messenger.models import SenderType
from messenger.telegram_sender import Telegram


def create_sender_factory(sender_type, params):
    if sender_type == SenderType.EMAIL:
        return Email(params)
    elif sender_type == SenderType.TLG:
        return Telegram(params)
    else:
        return None


class MessageSender:
    def __init__(self, sender_type, params):
        self.factory = create_sender_factory(sender_type, params)

    def send(self):
        message = None
        if self.factory:
            message = self.factory.send()
        else:
            print('SenderFactory not initialized')

        return message
