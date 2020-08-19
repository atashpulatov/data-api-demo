from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import ELEMENT_SEARCH_RETRY_INTERVAL
from framework.util.exception.MstrException import MstrException


class ExcelMainBrowserPage(BaseBrowserPage):
    OPEN_NEW_WORKBOOK_RETRY_NUMBER = 10

    APP_LAUNCHER_ELEM = "[title^='App launcher']"
    APP_LAUNCHER_EXCEL_ELEM = 'O365_AppTile_ExcelOnline'

    NEW_BLANK_WORKBOOK_ELEM = "[title^='New blank workbook']"
    NEW_BLANK_WORKBOOK_TITLE_PREFIX = 'Book '

    def open_new_workbook(self):
        self._open_excel_page()

        self._open_new_workbook()

    def _open_excel_page(self):
        """
        Opens Excel page using Apps launcher.
        """

        self.get_element_by_css(ExcelMainBrowserPage.APP_LAUNCHER_ELEM).click()
        self.get_element_by_id(ExcelMainBrowserPage.APP_LAUNCHER_EXCEL_ELEM).click()

    def _open_new_workbook(self):
        """
        Opens a new Excel Workbook.

        Ensures it's an Excel (not e.g. OneDrive) by checking if tab title starts with NEW_BLANK_WORKBOOK_TITLE_SUFFIX.
        If not - closes the tab and repeats opening a Workbook, at most OPEN_NEW_WORKBOOK_RETRY_NUMBER times.

        :raises MstrException: when not possible to open a new Workbook.
        """

        i = 0
        while i < ExcelMainBrowserPage.OPEN_NEW_WORKBOOK_RETRY_NUMBER:
            self.get_element_by_css(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM).click()
            self.pause(5)

            self.switch_to_excel_workbook_window()

            if self.get_page_title().startswith(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_TITLE_PREFIX):
                return

            self.close_current_tab()

            self.switch_to_excel_initial_window()

            self.pause(ELEMENT_SEARCH_RETRY_INTERVAL)

        raise MstrException('Error while opening a new Workbook.')
