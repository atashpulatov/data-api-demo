import json
import os
import re

from framework.driver.driver_type import DRIVER_TYPE_WINDOWS_DESKTOP, AVAILABLE_DRIVERS, DRIVER_TYPE_MAC_CHROME, \
    DRIVERS_SUPPORTING_IMAGE_RECOGNITION, DRIVER_TYPE_MAC_DESKTOP
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class ConfigUtil:
    CONFIG_DIR_PATH = os.path.join('framework', 'config')
    CONFIG_DEFAULT_FILE_NAME = 'config.json'
    CONFIG_FILE_NAME_PATTERN = r'^[a-zA-Z0-9-._]+$'
    CONFIG_FILE_NAME_SEARCH = re.compile(CONFIG_FILE_NAME_PATTERN)

    DRIVERS_SUPPORTING_ATTACHING_TO_EXISTING_SESSION = [
        DRIVER_TYPE_WINDOWS_DESKTOP,
        DRIVER_TYPE_MAC_CHROME,
        DRIVER_TYPE_MAC_DESKTOP
    ]

    PARAM_NAME_CONFIG_FILE_NAME = 'config_file'

    PARAM_NAME_DRIVER_TYPE = 'driver_type'
    PARAM_NAME_IMAGE_RECOGNITION_ENABLED = 'image_recognition_enabled'
    PARAM_NAME_CONNECT_TO_EXISTING_SESSION_ENABLED = 'connect_to_existing_session_enabled'
    PARAM_NAME_BROWSER_EXISTING_SESSION_EXECUTOR_URL = 'browser_existing_session_executor_url'
    PARAM_NAME_BROWSER_EXISTING_SESSION_ID = 'browser_existing_session_id'
    PARAM_WINDOWS_DESKTOP_EXCEL_ROOT_ELEMENT_NAME = 'windows_desktop_excel_root_element_name'
    PARAM_NAME_CLEANUP_AFTER_TEST_ENABLED = 'cleanup_after_test_enabled'
    PARAM_NAME_DRIVER_PATH_PREFIX = 'driver_path_'
    PARAM_NAME_HOST_URL_PREFIX = 'host_url_'
    PARAM_NAME_EXCEL_ADD_IN_ENVIRONMENT = 'excel_add_in_environment'
    PARAM_NAME_EXCEL_DESKTOP_ADD_IN_IMPORT_DATA_NAME = 'excel_desktop_add_in_import_data_name'
    PARAM_NAME_EXCEL_USER_NAME = 'excel_user_name'
    PARAM_NAME_EXCEL_USER_PASSWORD = 'excel_user_password'

    PARAM_BOOLEAN = [
        PARAM_NAME_IMAGE_RECOGNITION_ENABLED,
        PARAM_NAME_CONNECT_TO_EXISTING_SESSION_ENABLED,
        PARAM_NAME_CLEANUP_AFTER_TEST_ENABLED
    ]

    PARAM_VALUES_CACHE = {}

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
        driver_type = ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_DRIVER_TYPE)

        if driver_type not in AVAILABLE_DRIVERS:
            raise MstrException(
                'Specified driver type not allowed: [%s], available drivers: %s.' % (driver_type, AVAILABLE_DRIVERS))

        return driver_type

    @staticmethod
    def get_add_in_environment():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_EXCEL_ADD_IN_ENVIRONMENT)

    @staticmethod
    def get_excel_desktop_add_in_import_data_name():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_EXCEL_DESKTOP_ADD_IN_IMPORT_DATA_NAME)

    @staticmethod
    def get_default_excel_user_name():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_EXCEL_USER_NAME)

    @staticmethod
    def get_default_excel_user_password():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_EXCEL_USER_PASSWORD)

    @staticmethod
    def get_browser_existing_session_executor_url():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_BROWSER_EXISTING_SESSION_EXECUTOR_URL)

    @staticmethod
    def get_browser_existing_session_id():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_BROWSER_EXISTING_SESSION_ID)

    @staticmethod
    def get_windows_desktop_excel_root_element_name():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_WINDOWS_DESKTOP_EXCEL_ROOT_ELEMENT_NAME)

    @staticmethod
    def get_desktop_host():
        host_url_variable_name = '%s%s' % (ConfigUtil.PARAM_NAME_HOST_URL_PREFIX, ConfigUtil.get_driver_type())

        return ConfigUtil._get_variable_value(host_url_variable_name)

    @staticmethod
    def is_attaching_to_existing_session_enabled():
        if ConfigUtil.get_driver_type() in ConfigUtil.DRIVERS_SUPPORTING_ATTACHING_TO_EXISTING_SESSION:
            return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_CONNECT_TO_EXISTING_SESSION_ENABLED)

        return False

    @staticmethod
    def is_cleanup_after_tests_enabled():
        return ConfigUtil._get_variable_value(ConfigUtil.PARAM_NAME_CLEANUP_AFTER_TEST_ENABLED)

    @staticmethod
    def is_image_recognition_enabled():
        if ConfigUtil.PARAM_NAME_IMAGE_RECOGNITION_ENABLED in ConfigUtil.PARAM_VALUES_CACHE:
            return ConfigUtil.PARAM_VALUES_CACHE[ConfigUtil.PARAM_NAME_IMAGE_RECOGNITION_ENABLED]

        image_recognition_enabled = ConfigUtil._get_variable_value(
            ConfigUtil.PARAM_NAME_IMAGE_RECOGNITION_ENABLED,
            ignore_not_existing_variable=True
        ) is True

        if image_recognition_enabled:
            supported_by_driver = ConfigUtil.get_driver_type() in DRIVERS_SUPPORTING_IMAGE_RECOGNITION

            if image_recognition_enabled and not supported_by_driver:
                Util.log_warning('Image recognition enabled but not supported for [%s].' % ConfigUtil.get_driver_type())
                return False

        ConfigUtil.PARAM_VALUES_CACHE[ConfigUtil.PARAM_NAME_IMAGE_RECOGNITION_ENABLED] = image_recognition_enabled

        return ConfigUtil.PARAM_VALUES_CACHE[ConfigUtil.PARAM_NAME_IMAGE_RECOGNITION_ENABLED]

    @staticmethod
    def get_driver_executable_path():
        driver_path_variable_name = '%s%s' % (ConfigUtil.PARAM_NAME_DRIVER_PATH_PREFIX, ConfigUtil.get_driver_type())

        return ConfigUtil._get_variable_value(driver_path_variable_name)

    @staticmethod
    def _get_variable_value(variable_name, ignore_not_existing_variable=False):
        if variable_name in ConfigUtil.PARAM_VALUES_CACHE:
            return ConfigUtil.PARAM_VALUES_CACHE[variable_name]

        if variable_name in ConfigUtil.context.config.userdata:
            env_value = ConfigUtil.context.config.userdata[variable_name]

            if variable_name in ConfigUtil.PARAM_BOOLEAN:
                ConfigUtil.PARAM_VALUES_CACHE[variable_name] = (env_value == 'True')
            else:
                ConfigUtil.PARAM_VALUES_CACHE[variable_name] = env_value

            return ConfigUtil.PARAM_VALUES_CACHE[variable_name]

        if variable_name in ConfigUtil._get_config():
            ConfigUtil.PARAM_VALUES_CACHE[variable_name] = ConfigUtil._get_config()[variable_name]
            return ConfigUtil.PARAM_VALUES_CACHE[variable_name]

        if ignore_not_existing_variable:
            ConfigUtil.PARAM_VALUES_CACHE[variable_name] = None
            return ConfigUtil.PARAM_VALUES_CACHE[variable_name]

        raise MstrException('Configuration variable [%s] does not exist but is required.' % variable_name)

    @staticmethod
    def _get_config():
        config_file_full_path = ConfigUtil._prepare_full_config_path()

        if not ConfigUtil.config:
            ConfigUtil.config = ConfigUtil.get_json_data(config_file_full_path)

        return ConfigUtil.config

    @staticmethod
    def _prepare_full_config_path():
        if ConfigUtil.PARAM_NAME_CONFIG_FILE_NAME in ConfigUtil.context.config.userdata:
            config_file_name = ConfigUtil.context.config.userdata[ConfigUtil.PARAM_NAME_CONFIG_FILE_NAME]

            if not ConfigUtil.CONFIG_FILE_NAME_SEARCH.match(config_file_name):
                raise MstrException(
                    'Invalid config file name, must match %s: %s' % (ConfigUtil.CONFIG_FILE_NAME_PATTERN,
                                                                            config_file_name))
        else:
            config_file_name = ConfigUtil.CONFIG_DEFAULT_FILE_NAME

        config_file_full_path = os.path.join(ConfigUtil.CONFIG_DIR_PATH, config_file_name)

        if not os.path.exists(config_file_full_path):
            raise MstrException('Invalid config file name, file does not exist: %s' % config_file_name)

        return os.path.join(ConfigUtil.CONFIG_DIR_PATH, config_file_name)

    @staticmethod
    def get_json_data(file_path):
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)

        except FileNotFoundError:
            data = {}

        return data
