from pages.base_browser_page import BaseBrowserPage
from util.config_util import ConfigUtil
from util.const import ELEMENT_SEARCH_RETRY_NUMBER


class ExcelMenuBrowserPage(BaseBrowserPage):
    ADDIN_ELEM = '''//span[translate(string(),' ','')=translate('%s',' ','')]'''

    def click_add_in_elem(self):
        environment = ConfigUtil.get_add_in_environment()

        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            self.focus_on_excel_frame()

            if self.get_element_coordinates_by_xpath(ExcelMenuBrowserPage.ADDIN_ELEM % environment, timeout=3):
                break

            self.pause(5)

        self.get_element_by_xpath(ExcelMenuBrowserPage.ADDIN_ELEM % environment).click()
