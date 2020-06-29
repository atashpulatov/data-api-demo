from pages.base_browser_page import BaseBrowserPage
from util.config_util import ConfigUtil
from util.const import ELEMENT_SEARCH_RETRY_NUMBER


class ExcelMenuBrowserPage(BaseBrowserPage):
    ICON_ELEM = '.cui-ctl-largelabel'

    def click_add_in_elem(self):
        add_in_environment = ConfigUtil.get_add_in_environment()

        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            self.focus_on_excel_frame()

            all_candidates = self.get_elements_by_css(ExcelMenuBrowserPage.ICON_ELEM)
            found_environment_elements = list(filter(lambda item: add_in_environment in item.text, all_candidates))

            if len(found_environment_elements) == 1:
                found_environment_elements[0].click()
                return

            self.pause(5)

        raise Exception('Cannot find AddIn element.')
