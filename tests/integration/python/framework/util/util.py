import logging
import re
from time import sleep


class Util:
    TO_ALPHA_REGEX = re.compile(r'\W')

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

    @staticmethod
    def normalize_file_name(file_name):
        return Util.TO_ALPHA_REGEX.sub('_', file_name).lower()
