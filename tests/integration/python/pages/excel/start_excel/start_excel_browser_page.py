from framework.pages_base.base_browser_page import BaseBrowserPage
from pages.excel.excel_login.excel_login_browser_page import ExcelLoginBrowserPage
from pages.excel.excel_main.excel_main_browser_page import ExcelMainBrowserPage


class StartExcelBrowserPage(BaseBrowserPage):
    def __init__(self):
        super().__init__()

        self.excel_login_browser_page = ExcelLoginBrowserPage()
        self.excel_main_browser_page = ExcelMainBrowserPage()

    EXCEL_URL = 'https://www.office.com/launch/excel'

    excel_not_started = True

    def go_to_excel(self):
        self._go_to_excel_by_url()

        self._login_to_excel()

        self._go_to_excel_by_url()  # This solution is temporary TODO check if you are on excel page EXCEL_URL

        self.excel_main_browser_page.open_new_work_book()

        self.switch_to_excel_workbook_window()

        # TODO check if you are on excel_workbook_window (sometimes it is switching to onedrive)

    def _go_to_excel_by_url(self):
        self.driver.get(StartExcelBrowserPage.EXCEL_URL)

    def _login_to_excel(self):
        if StartExcelBrowserPage.excel_not_started:
            self.excel_login_browser_page.login_to_excel()

            StartExcelBrowserPage.excel_not_started = False

    def maximize_excel_window(self):
        self.driver.maximize_window()
        # self.driver.set_window_size(1920, 1080)
