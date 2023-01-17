from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException


class ExcelMainBrowserPage(BaseBrowserPage):
    OPEN_NEW_WORKBOOK_RETRY_NUMBER = 10

    APP_LAUNCHER_ELEM = 'O365_MainLink_NavMenu'
    APP_LAUNCHER_EXCEL_ELEM = 'O365_AppTile_ExcelOnline'

    RIGHT_MENU_EXCEL_ICON_XPATH = '//button[contains(@aria-label, "Go to Excel")]'

    NEW_BLANK_WORKBOOK_ELEM_XPATH = '//div[contains(@aria-label, "Create a new blank workbook")]'

    HEAD_BRAND_ELEM_CSS = '#AppBrand'
    HEAD_BRAND_EXCEL_NAME = 'Excel'

    def open_new_workbook(self):
        if self.check_if_element_exists_by_xpath(
                ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM_XPATH, timeout=Const.SHORT_TIMEOUT):
            self._open_new_workbook()
        else:
            self._select_excel_icon()

            self._open_new_workbook()

    def _open_excel_page(self):
        """
        Opens Excel page using Apps launcher.
        """

        self.get_element_by_id(ExcelMainBrowserPage.APP_LAUNCHER_ELEM).click()
        self.get_element_by_id(ExcelMainBrowserPage.APP_LAUNCHER_EXCEL_ELEM).click()

    def _select_excel_icon(self):
        """
        Selects Excel icon on the right menu
        """
        self.get_element_by_xpath(ExcelMainBrowserPage.RIGHT_MENU_EXCEL_ICON_XPATH).click()

    def _open_new_workbook(self):
        """
        Opens a new Excel Workbook.

        Ensures it's an Excel (not e.g. OneDrive) by checking if tab contains Excel frame (tab_contains_excel_frame())
        and HEAD_BRAND_ELEM_CSS is HEAD_BRAND_EXCEL_NAME, which is i18n independent.

        If not - closes the tab and repeats opening a Workbook, at most OPEN_NEW_WORKBOOK_RETRY_NUMBER times.

        IMPORTANT NOTE - due to Excel issue causing freezing, after opening a new tab, it's being closed and reopened
        again a few times :( (see usage of open_count variable).

        :raises MstrException: when not possible to open a new Workbook.
        """

        open_count = 0

        i = 0
        while i < ExcelMainBrowserPage.OPEN_NEW_WORKBOOK_RETRY_NUMBER:
            self.get_element_by_xpath(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM_XPATH).click()
            self.pause(Const.MEDIUM_TIMEOUT)

            self.switch_to_excel_workbook_window()

            if self.tab_contains_excel_frame():
                if open_count < 3:
                    open_count += 1

                else:
                    self.focus_on_excel_frame()

                    brand_name_element = self.find_element_in_list_by_text_safe(
                        ExcelMainBrowserPage.HEAD_BRAND_ELEM_CSS,
                        ExcelMainBrowserPage.HEAD_BRAND_EXCEL_NAME
                    )

                    if brand_name_element:
                        return

            self.close_current_tab()

            self.switch_to_excel_initial_window()

            self.pause(Const.DEFAULT_WAIT_BETWEEN_CHECKS)

        raise MstrException('Error while opening a new Workbook.')
