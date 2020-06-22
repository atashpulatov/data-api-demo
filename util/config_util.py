import json
import os

from driver.driver_type import DRIVER_TYPE_WINDOWS_DESKTOP
from util.util import Util


class ConfigUtil:
    CONFIG_FILE_PATH = os.path.join('config', 'config.json')

    DRIVERS_SUPPORTING_IMAGE_RECOGNITION = [DRIVER_TYPE_WINDOWS_DESKTOP]
    DRIVERS_SUPPORTING_ATTACHING_TO_OPEN_EXCEL = [DRIVER_TYPE_WINDOWS_DESKTOP]

    context = None
    config = None
    image_recognition_enabled = None

    @staticmethod
    def initialize(context):
        """
        Initializes ConfigUtil by providing behave's context. Must be called before usage,
        e.g. in environment.before_all().
        :param context: behave's context
        """
        ConfigUtil.context = context

    # TODO validate driver_type
    @staticmethod
    def get_driver_type():
        env_driver_type = ConfigUtil.context.config.userdata['DRIVER_TYPE']

        if env_driver_type:
            return env_driver_type

        return ConfigUtil.get_config()['driver_type']

    @staticmethod
    def get_add_in_environment():
        return ConfigUtil.get_config()['excel']['add_in_environment']

    @staticmethod
    def get_default_excel_user_name():
        return ConfigUtil.get_config()['excel']['user_name']

    @staticmethod
    def get_default_excel_user_password():
        return ConfigUtil.get_config()['excel']['user_password']

    @staticmethod
    def get_desktop_host():
        return ConfigUtil.get_config()['desktop_host'][ConfigUtil.get_driver_type()]

    @staticmethod
    def is_attaching_to_open_excel_enabled():
        if ConfigUtil.get_driver_type() in ConfigUtil.DRIVERS_SUPPORTING_ATTACHING_TO_OPEN_EXCEL:
            return ConfigUtil.get_config()['connect_to_open_excel_enabled']

        return False

    @staticmethod
    def is_cleanup_after_tests_enabled():
        return ConfigUtil.get_config()['cleanup_after_test_enabled']

    @staticmethod
    def is_image_recognition_enabled():
        if ConfigUtil.image_recognition_enabled is None:
            ConfigUtil.image_recognition_enabled = ConfigUtil._check_if_image_recognition_is_enabled()

        return ConfigUtil.image_recognition_enabled

    @staticmethod
    def _check_if_image_recognition_is_enabled():
        if 'image_recognition_enabled' in ConfigUtil.get_config():
            image_recognition_enabled = ConfigUtil.get_config()['image_recognition_enabled']
            supported_by_driver = ConfigUtil.get_driver_type() in ConfigUtil.DRIVERS_SUPPORTING_IMAGE_RECOGNITION

            if image_recognition_enabled and not supported_by_driver:
                Util.log_warning('Image recognition is not supported for %s' % ConfigUtil.get_driver_type())
                return False

            return image_recognition_enabled

        return False

    @staticmethod
    def get_driver_executable_path():
        return ConfigUtil.get_config()['driver_executable_path'][ConfigUtil.get_driver_type()]

    @staticmethod
    def get_config():
        if not ConfigUtil.config:
            ConfigUtil.config = ConfigUtil.get_json_data(ConfigUtil.CONFIG_FILE_PATH)

        return ConfigUtil.config

    @staticmethod
    def get_json_data(file_path):
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)

        except FileNotFoundError:
            data = {}

        return data
