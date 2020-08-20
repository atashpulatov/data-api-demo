from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import ELEMENT_SEARCH_RETRY_INTERVAL
from framework.util.exception.MstrException import MstrException


class ExcelMainBrowserPage(BaseBrowserPage):
    OPEN_NEW_WORKBOOK_RETRY_NUMBER = 10

    APP_LAUNCHER_ELEM = 'O365_MainLink_NavMenu'
    APP_LAUNCHER_EXCEL_ELEM = 'O365_AppTile_ExcelOnline'

    NEW_BLANK_WORKBOOK_ELEM = '.new-template-icon'

    HEAD_BRAND_ELEM = '.headBrand'
    HEAD_BRAND_EXCEL_NAME = 'Excel'

    def open_new_workbook(self):
        self._open_excel_page()

        self._open_new_workbook()

    def _open_excel_page(self):
        """
        Opens Excel page using Apps launcher.
        """

        self.get_element_by_id(ExcelMainBrowserPage.APP_LAUNCHER_ELEM).click()
        self.get_element_by_id(ExcelMainBrowserPage.APP_LAUNCHER_EXCEL_ELEM).click()

    def _open_new_workbook(self):
        """
        Opens a new Excel Workbook.

        Ensures it's an Excel (not e.g. OneDrive) by checking if tab contains Excel frame (tab_contains_excel_frame())
        and HEAD_BRAND_ELEM is HEAD_BRAND_EXCEL_NAME, which is i18n independent.

        If not - closes the tab and repeats opening a Workbook, at most OPEN_NEW_WORKBOOK_RETRY_NUMBER times.

        :raises MstrException: when not possible to open a new Workbook.
        """

        i = 0
        while i < ExcelMainBrowserPage.OPEN_NEW_WORKBOOK_RETRY_NUMBER:
            self.get_element_by_css(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM).click()
            self.pause(5)

            self.switch_to_excel_workbook_window()

            if self.tab_contains_excel_frame():
                self.focus_on_excel_frame()

                brand_name_element = self.find_element_in_list_by_text_safe(
                    ExcelMainBrowserPage.HEAD_BRAND_ELEM,
                    ExcelMainBrowserPage.HEAD_BRAND_EXCEL_NAME
                )

                if brand_name_element:
                    return

            self.close_current_tab()

            self.switch_to_excel_initial_window()

            self.pause(ELEMENT_SEARCH_RETRY_INTERVAL)

        raise MstrException('Error while opening a new Workbook.')
