from framework.pages_base.base_browser_page import BasePage


class ExcelMainBrowserPage(BasePage):
    APP_LAUNCHER_ELEM = "[title^='App launcher']"

    APP_LAUNCHER_EXCEL_ELEM = 'O365_AppTile_ExcelOnline'

    NEW_BLANK_WORKBOOK_ELEM = "[title^='New blank workbook']"

    def open_new_work_book(self):
        self.get_element_by_css(ExcelMainBrowserPage.APP_LAUNCHER_ELEM).click()

        self.get_element_by_id(ExcelMainBrowserPage.APP_LAUNCHER_EXCEL_ELEM).click()

        self.get_element_by_css(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM).click()
