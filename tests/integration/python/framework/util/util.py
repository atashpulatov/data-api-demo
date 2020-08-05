import logging
from time import sleep


class Util:
    @staticmethod
    def log(text):
        logging.debug(text)

    @staticmethod
    def log_warning(text):
        logging.warning(text)

    @staticmethod
    def log_error(text):
        logging.error(text)

    @staticmethod
    def pause(secs):
        Util.log(('pause', secs))

        sleep(secs)
