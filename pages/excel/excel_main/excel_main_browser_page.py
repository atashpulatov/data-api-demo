from pages.base_browser_page import BasePage
from util.util import Util


class ExcelMainBrowserPage(BasePage):
    NEW_BLANK_WORKBOOK_ELEM = '''[title^='New blank workbook']'''

    def open_new_work_book(self):
        Util.pause(7)  # TODO check if present

        self.get_element_by_css(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM).click()
