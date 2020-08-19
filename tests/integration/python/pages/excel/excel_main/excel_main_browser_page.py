from framework.pages_base.base_browser_page import BasePage


class ExcelMainBrowserPage(BasePage):
    APP_LAUNCHER_ELEM = "[title^='App launcher']"

    WELCOME_PAGE_EXCEL_ARIA_ELEM = "[aria-label^='Excel']"

    NEW_BLANK_WORKBOOK_ELEM = "[title^='New blank workbook']"

    def open_new_work_book(self):
        self.get_element_by_css(ExcelMainBrowserPage.APP_LAUNCHER_ELEM).click()

        self.get_element_by_css(ExcelMainBrowserPage.WELCOME_PAGE_EXCEL_ARIA_ELEM).click()

        self.get_element_by_css(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM).click()
