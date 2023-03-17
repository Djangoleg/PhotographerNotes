import abc


class Sender(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def send(self):
        pass
