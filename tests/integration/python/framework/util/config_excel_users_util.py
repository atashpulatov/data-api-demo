import os

from framework.util.config_util import ConfigUtil

# TODO update docs
class ConfigExcelUsersUtil:
    CONFIG_EXCEL_USERS_FILE_PATH = os.path.join('framework', 'config', 'config_excel_users.json')

    config_excel_users = None

    @staticmethod
    def get_excel_user_name(locale_name):
        return ConfigExcelUsersUtil._get_config()[locale_name]['username']

    @staticmethod
    def get_excel_user_password(locale_name):
        return ConfigExcelUsersUtil._get_config()[locale_name]['password']

    @staticmethod
    def _get_config():
        if not ConfigExcelUsersUtil.config_excel_users:
            ConfigExcelUsersUtil.config_excel_users = ConfigUtil.get_json_data(
                ConfigExcelUsersUtil.CONFIG_EXCEL_USERS_FILE_PATH)

        return ConfigExcelUsersUtil.config_excel_users
