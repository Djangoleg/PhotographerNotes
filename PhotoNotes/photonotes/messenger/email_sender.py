from django.core.mail import send_mail

from PhotoNotes import settings
from messenger.models import Message, MessageStatus
from messenger.sender_factory import Sender
from users.models import User


class Email(Sender):

    def __init__(self, params):
        """
        Create new Message object.
        params: {'subject': value, 'body': value, 'recipient_list': value, 'user_pk': value}
        """
        subject = params.get('subject', str())
        body = params.get('body', str())
        self.recipient_list = params.get('recipient_list', list())

        user = None
        user_pk = params.get('user_pk', None)
        if user_pk:
            user = User.objects.get(pk=user_pk)

        self.recipient_list_str = str()
        if isinstance(self.recipient_list, list):
            self.recipient_list_str = ','.join(str(r) for r in self.recipient_list)

        self.message = Message(recipient_list=self.recipient_list_str, subject=subject, body=body,
                               user=user)
        self.message.save()

    def send(self):
        if self.message.subject and self.message.body and isinstance(self.recipient_list, list) and \
                len(self.recipient_list) > 0:
            try:
                send_mail(self.message.subject, self.message.body, settings.EMAIL_HOST_USER, self.recipient_list,
                          fail_silently=False)
                self.message.status = MessageStatus.SND
                self.message.save()
                return self.message
            except Exception as e:
                self.message.status = MessageStatus.ERR
                self.message.error_message = e
                self.message.save()
                return self.message
        else:
            err_message = f'Has problem with next parameters: subject = {self.message.subject}; ' \
                          f'message = {self.message.body}; recipient_list = {self.recipient_list_str};'
            self.message.status = MessageStatus.ERR
            self.message.error_message = err_message
            self.message.save()
            print('Message not sent!')
            print(err_message)
            return self.message
