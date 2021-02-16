from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.config_util import ConfigUtil
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util
from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage


class ExcelMenuBrowserPage(BaseBrowserPage):
    ICON_ELEM = '.cui-ctl-largelabel'
    CLOSE_ADD_IN_BUTTON = 'AgaveTaskpaneCloseButtonId'
    NAME_BOX = '#m_excelWebRenderer_ewaCtl_NameBox-Medium > a'

    def __init__(self):
        super().__init__()

        self.excel_sheet_browser_page = ExcelSheetBrowserPage()

    def click_add_in_elem(self):
        self._get_add_in_button().click()

    def get_environment_id(self):
        """
        Gets environment id from Add-In name, used for preparing url for REST API calls.

        E.g. for current_env_RV_NNNNNN it's NNNNNN.

        :return: environment id.
        """
        add_in_environment = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        add_in_button = self._get_add_in_button()
        add_in_name = add_in_button.text

        return Util.extract_environment_id(add_in_environment, add_in_name)

    def _get_add_in_button(self):
        add_in_environment = ConfigUtil.get_add_in_environment()

        i = 0
        while i < Const.ELEMENT_SEARCH_RETRY_NUMBER:
            self.focus_on_excel_frame()

            all_candidates = self.get_elements_by_css(ExcelMenuBrowserPage.ICON_ELEM)
            found_environment_elements = list(filter(
                lambda item: item.text.startswith(add_in_environment), all_candidates
            ))

            if len(found_environment_elements) == 1:
                return found_environment_elements[0]

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

            i += 1

        raise MstrException('Cannot find AddIn element.')

    def click_close_add_in_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelMenuBrowserPage.CLOSE_ADD_IN_BUTTON).click()

    def select_object_from_name_box(self, object_number):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelMenuBrowserPage.NAME_BOX).click()

        for i in range(int(object_number)):
            self.press_tab()

        self.press_enter()

    def is_object_name_in_name_box_correct(self, object_number, expected_name):
        raise MstrException('TODO implement')

    def are_timestamps_different(self, object_number_1, object_number_2):
        raise MstrException('TODO implement')
