from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.config_util import ConfigUtil
from framework.util.const import ELEMENT_SEARCH_RETRY_NUMBER, ELEMENT_SEARCH_RETRY_INTERVAL
from framework.util.exception.MstrException import MstrException
from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage


class ExcelMenuBrowserPage(BaseBrowserPage):
    ICON_ELEM = '.cui-ctl-largelabel'
    CLOSE_PLUGIN_BUTTON = 'AgaveTaskpaneCloseButtonId'

    def __init__(self):
        super().__init__()

        self.excel_sheet_browser_page = ExcelSheetBrowserPage()

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

            self.pause(ELEMENT_SEARCH_RETRY_INTERVAL)

        raise MstrException('Cannot find AddIn element.')

    def click_close_plugin_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelMenuBrowserPage.CLOSE_PLUGIN_BUTTON).click()
