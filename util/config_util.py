import json
import os

from driver.driver_type import DRIVER_TYPE_WINDOWS_DESKTOP, AVAILABLE_DRIVERS
from util.exception.MstrException import MstrException
from util.util import Util


class ConfigUtil:
    CONFIG_FILE_PATH = os.path.join('config', 'config.json')

    DRIVERS_SUPPORTING_IMAGE_RECOGNITION = [DRIVER_TYPE_WINDOWS_DESKTOP]
    DRIVERS_SUPPORTING_ATTACHING_TO_OPEN_EXCEL = [DRIVER_TYPE_WINDOWS_DESKTOP]

    VAR_DRIVER_TYPE = 'driver_type'
    VAR_IMAGE_RECOGNITION_ENABLED = 'image_recognition_enabled'
    VAR_CONNECT_TO_OPEN_EXCEL_ENABLED = 'connect_to_open_excel_enabled'
    VAR_CLEANUP_AFTER_TEST_ENABLED = 'cleanup_after_test_enabled'
    VAR_DRIVER_PATH_PREFIX = 'driver_path_'
    VAR_HOST_URL_PREFIX = 'host_url_'
    VAR_EXCEL_ADD_IN_ENVIRONMENT = 'excel_add_in_environment'
    VAR_EXCEL_USER_NAME = 'excel_user_name'
    VAR_EXCEL_USER_PASSWORD = 'excel_user_password'

    VAR_VALUES_CACHE = {}

    context = None
    config = None

    @staticmethod
    def initialize(context):
        """
        Initializes ConfigUtil by providing behave's context. Must be called before usage,
        e.g. in environment.before_all().
        :param context: behave's context
        """
        ConfigUtil.context = context

    @staticmethod
    def get_driver_type():
        driver_type = ConfigUtil._get_variable_value(ConfigUtil.VAR_DRIVER_TYPE)

        if driver_type not in AVAILABLE_DRIVERS:
            raise MstrException(
                'Specified driver type not allowed: [%s], available drivers: %s.' % (driver_type, AVAILABLE_DRIVERS))

        return driver_type

    @staticmethod
    def get_add_in_environment():
        return ConfigUtil._get_variable_value(ConfigUtil.VAR_EXCEL_ADD_IN_ENVIRONMENT)

    @staticmethod
    def get_default_excel_user_name():
        return ConfigUtil._get_variable_value(ConfigUtil.VAR_EXCEL_USER_NAME)

    @staticmethod
    def get_default_excel_user_password():
        return ConfigUtil._get_variable_value(ConfigUtil.VAR_EXCEL_USER_PASSWORD)

    @staticmethod
    def get_desktop_host():
        host_url_variable_name = '%s%s' % (ConfigUtil.VAR_HOST_URL_PREFIX, ConfigUtil.get_driver_type())

        return ConfigUtil._get_variable_value(host_url_variable_name)

    @staticmethod
    def is_attaching_to_open_excel_enabled():
        if ConfigUtil.get_driver_type() in ConfigUtil.DRIVERS_SUPPORTING_ATTACHING_TO_OPEN_EXCEL:
            return ConfigUtil._get_variable_value(ConfigUtil.VAR_CONNECT_TO_OPEN_EXCEL_ENABLED)

        return False

    @staticmethod
    def is_cleanup_after_tests_enabled():
        return ConfigUtil._get_variable_value(ConfigUtil.VAR_CLEANUP_AFTER_TEST_ENABLED)

    @staticmethod
    def is_image_recognition_enabled():
        if ConfigUtil.VAR_IMAGE_RECOGNITION_ENABLED in ConfigUtil.VAR_VALUES_CACHE:
            return ConfigUtil.VAR_VALUES_CACHE[ConfigUtil.VAR_IMAGE_RECOGNITION_ENABLED]

        image_recognition_enabled = ConfigUtil._get_variable_value(
            ConfigUtil.VAR_IMAGE_RECOGNITION_ENABLED,
            ignore_not_existing_variable=True
        ) is True

        if image_recognition_enabled:
            supported_by_driver = ConfigUtil.get_driver_type() in ConfigUtil.DRIVERS_SUPPORTING_IMAGE_RECOGNITION

            if image_recognition_enabled and not supported_by_driver:
                Util.log_warning('Image recognition enabled but not supported for [%s].' % ConfigUtil.get_driver_type())
                return False

        ConfigUtil.VAR_VALUES_CACHE[ConfigUtil.VAR_IMAGE_RECOGNITION_ENABLED] = image_recognition_enabled

        return ConfigUtil.VAR_VALUES_CACHE[ConfigUtil.VAR_IMAGE_RECOGNITION_ENABLED]

    @staticmethod
    def get_driver_executable_path():
        driver_path_variable_name = '%s%s' % (ConfigUtil.VAR_DRIVER_PATH_PREFIX, ConfigUtil.get_driver_type())

        return ConfigUtil._get_variable_value(driver_path_variable_name)

    @staticmethod
    def _get_variable_value(variable_name, ignore_not_existing_variable=False):
        if variable_name in ConfigUtil.VAR_VALUES_CACHE:
            return ConfigUtil.VAR_VALUES_CACHE[variable_name]

        if variable_name in ConfigUtil.context.config.userdata:
            env_value = ConfigUtil.context.config.userdata[variable_name]

            ConfigUtil.VAR_VALUES_CACHE[variable_name] = env_value if env_value != 'True' else True

            return ConfigUtil.VAR_VALUES_CACHE[variable_name]

        if variable_name in ConfigUtil._get_config():
            ConfigUtil.VAR_VALUES_CACHE[variable_name] = ConfigUtil._get_config()[variable_name]
            return ConfigUtil.VAR_VALUES_CACHE[variable_name]

        if ignore_not_existing_variable:
            ConfigUtil.VAR_VALUES_CACHE[variable_name] = None
            return ConfigUtil.VAR_VALUES_CACHE[variable_name]

        raise MstrException('Configuration variable [%s] does not exist but is required.' % variable_name)

    @staticmethod
    def _get_config():
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
