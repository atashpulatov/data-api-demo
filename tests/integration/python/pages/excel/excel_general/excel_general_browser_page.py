from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import DEFAULT_LOCALE_NAME
from framework.util.test_util import TestUtil
from pages.excel.excel_login.excel_login_browser_page import ExcelLoginBrowserPage
from pages.excel.excel_main.excel_main_browser_page import ExcelMainBrowserPage


class ExcelGeneralBrowserPage(BaseBrowserPage):
    def __init__(self):
        super().__init__()

        self.excel_login_browser_page = ExcelLoginBrowserPage()
        self.excel_main_browser_page = ExcelMainBrowserPage()

    EXCEL_URL = 'https://www.office.com/launch/excel'

    excel_not_started = True

    def go_to_excel(self, locale_name=DEFAULT_LOCALE_NAME):
        self._go_to_excel_by_url()

        self._login_to_excel(locale_name)

        self.excel_main_browser_page.open_new_workbook()

        self.switch_to_excel_workbook_window()

    def _go_to_excel_by_url(self):
        self.driver.get(ExcelGeneralBrowserPage.EXCEL_URL)

    def _login_to_excel(self, locale_name):
        if ExcelGeneralBrowserPage.excel_not_started:
            self.excel_login_browser_page.login_to_excel(locale_name)

            ExcelGeneralBrowserPage.excel_not_started = False

    def maximize_excel_window(self):
        self.driver.maximize_window()
        # self.driver.set_window_size(1920, 1080)

    def change_excel_window_size(self, width, height):
        self.driver.set_window_size(width, height)

    def close_excel(self):
        TestUtil.global_test_cleanup()

        ExcelGeneralBrowserPage.excel_not_started = True
