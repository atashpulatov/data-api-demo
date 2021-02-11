import time

from framework.pages_base.base_page import BasePage
from framework.util.config_excel_users_util import ConfigExcelUsersUtil
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException


class ExcelLoginBrowserPage(BasePage):
    USERNAME_INPUT_FIELD = 'i0116'
    PASSWORD_FIELD = 'i0118'
    NEXT_BUTTON = 'idSIButton9'
    SIGN_IN_BUTTON = 'idSIButton9'
    YES_BUTTON = 'idSIButton9'

    LOGIN_HEADER_ELEMENT = 'loginHeader'
    LOGIN_HEADER_ENTER_PASSWORD = 'Enter password'

    def login_to_excel(self, locale_name):
        self._enter_user_name(locale_name)

        self._enter_password(locale_name)

        self.get_element_by_id(ExcelLoginBrowserPage.YES_BUTTON).click()

    def _enter_user_name(self, locale_name):
        excel_user_name = ConfigExcelUsersUtil.get_excel_user_name(locale_name)

        user_name_field = self.get_element_by_id(ExcelLoginBrowserPage.USERNAME_INPUT_FIELD)
        user_name_field.send_keys_with_check(excel_user_name)

        self.get_element_by_id(ExcelLoginBrowserPage.NEXT_BUTTON).click()

    def _enter_password(self, locale_name):
        excel_user_password = ConfigExcelUsersUtil.get_excel_user_password(locale_name)

        self._ensure_password_window_is_open()

        user_password_field = self.get_element_by_id(ExcelLoginBrowserPage.PASSWORD_FIELD)
        user_password_field.send_keys_with_check(excel_user_password)

        self.get_element_by_id(ExcelLoginBrowserPage.SIGN_IN_BUTTON).click()

    def _ensure_password_window_is_open(self):
        end_time = time.time() + Const.MEDIUM_TIMEOUT
        while time.time() < end_time:
            login_header = self.get_element_by_id(
                ExcelLoginBrowserPage.LOGIN_HEADER_ELEMENT,
                timeout=Const.SHORT_TIMEOUT,
                safe=True
            )

            if login_header and login_header.text == ExcelLoginBrowserPage.LOGIN_HEADER_ENTER_PASSWORD:
                return

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

        raise MstrException('Error when entering password, Enter password window still visible.')
