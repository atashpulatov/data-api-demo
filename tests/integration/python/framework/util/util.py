import logging
import re
from datetime import datetime
from time import sleep

from framework.util.exception.mstr_exception import MstrException


class Util:
    TO_ALPHA_REGEX = re.compile(r'\W')
    CURRENT_DATETIME_PATTERN = '%y%m%d_%H%M%S'
    EXTRACT_ENVIRONMENT_ID_PATTERN = '^%s_(.+?)$'

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

    @staticmethod
    def prepare_current_datetime_string():
        return datetime.now().strftime(Util.CURRENT_DATETIME_PATTERN)

    @staticmethod
    def extract_environment_id(environment_prefix, environment_name):
        m = re.search(Util.EXTRACT_ENVIRONMENT_ID_PATTERN % environment_prefix, environment_name)
        if m:
            return m.group(1)

        raise MstrException('Error when extracting environment id from name, environment_prefix: '
                            f'[{environment_prefix}], environment_name: [{environment_name}]')
