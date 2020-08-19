from framework.driver.driver_factory import DriverFactory
# from pages_set.pages_set_factory import PagesSetFactory
from framework.pages_base.base_browser_page import BaseBrowserPage
from pages.excel.excel_login.excel_login_browser_page import ExcelLoginBrowserPage
from pages.excel.excel_main.excel_main_browser_page import ExcelMainBrowserPage
from framework.util.test_util import TestUtil


class ExcelGeneralBrowserPage(BaseBrowserPage):
    def __init__(self):
        super().__init__()

        self.excel_login_browser_page = ExcelLoginBrowserPage()
        self.excel_main_browser_page = ExcelMainBrowserPage()

    EXCEL_URL = 'https://www.office.com/launch/excel'

    excel_not_started = True

    def go_to_excel(self):
        self._go_to_excel_by_url()

        self._login_to_excel()

        self.excel_main_browser_page.open_new_workbook()

        self.switch_to_excel_workbook_window()

    def _go_to_excel_by_url(self):
        self.driver.get(ExcelGeneralBrowserPage.EXCEL_URL)

    def _login_to_excel(self):
        if ExcelGeneralBrowserPage.excel_not_started:
            self.excel_login_browser_page.login_to_excel()

            ExcelGeneralBrowserPage.excel_not_started = False

    def maximize_excel_window(self):
        self.driver.maximize_window()
        # self.driver.set_window_size(1920, 1080)


    def close_excel(self):
        TestUtil.global_test_cleanup()


    def open_excel_and_login(self, locale_name):
        DriverFactory.reset_driver()
        # PagesSetFactory.reset_pages_set()

        self.go_to_excel()

        self.maximize_excel_window()

        self.excel_menu_browser_page.click_add_in_elem()


