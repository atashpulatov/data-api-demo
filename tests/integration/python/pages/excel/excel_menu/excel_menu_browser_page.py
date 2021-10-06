import re

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.config_util import ConfigUtil
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException
from framework.util.util import Util


class ExcelMenuBrowserPage(BaseBrowserPage):
    ICON_ELEM = 'button[data-unique-id^="Ribbon-AddinControl"]'
    CLOSE_ADD_IN_BUTTON = 'AgaveTaskpaneCloseButtonId'
    NAME_BOX = '#m_excelWebRenderer_ewaCtl_NameBox-Medium > a'

    MAIN_MENU_HOME_BUTTON_ID = 'Home'
    MAIN_MENU_INSERT_BUTTON_ID = 'Insert'

    NAME_BOX_DROPDOWN_BUTTON_CSS = '.cui-dd-arrow-button'
    NAME_BOX_ITEMS_CSS = 'li.cui-menusection-items'

    MODAL_DIV_CSS = '.cui-modalDiv'
    ADD_IN_POPUP_MODAL_BUTTONS = '.ms-Fabric button'
    ENABLE_BUTTON_ID = 'enableSpan'

    def click_add_in_elem(self):
        self._get_add_in_button().click()

    def get_environment_id(self):
        """
        Gets environment id from Add-In name, used for preparing url for REST API calls.

        E.g. for current_env_RV_NNNNNN it's NNNNNN.

        :return: environment id.
        """
        add_in_environment = ConfigUtil.get_add_in_environment()

        add_in_button = self._get_add_in_button()
        add_in_name = add_in_button.text

        return Util.extract_environment_id(add_in_environment, add_in_name)

    def _get_add_in_button(self):
        add_in_environment = ConfigUtil.get_add_in_environment()
        return self._get_add_in_button_by_name(add_in_environment)

    def _get_add_in_button_by_name(self, add_in_name):
        i = 0
        while i < Const.ELEMENT_SEARCH_RETRY_NUMBER:
            self.focus_on_excel_frame()

            all_candidates = self.get_elements_by_css(ExcelMenuBrowserPage.ICON_ELEM)
            found_environment_elements = list(filter(
                lambda item: item.text.startswith(add_in_name), all_candidates
            ))

            if len(found_environment_elements) == 1:
                return found_environment_elements[0]

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

            i += 1

        raise MstrException('Cannot find AddIn element.')

    def click_ub_add_in_button(self, add_in_name):
        add_in_button = self._get_add_in_button_by_name(add_in_name)
        add_in_button.click()

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
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelMenuBrowserPage.NAME_BOX_DROPDOWN_BUTTON_CSS).click()

        name_box_items = self.get_elements_by_css(ExcelMenuBrowserPage.NAME_BOX_ITEMS_CSS)
        name_box_item_name = name_box_items[int(object_number) - 1].text
        name_box_item_name_without_timestamp = re.sub(r'_\d+$', '_', name_box_item_name)

        self.get_element_by_css(ExcelMenuBrowserPage.MODAL_DIV_CSS).click()

        return expected_name == name_box_item_name_without_timestamp

    def are_timestamps_equal(self, first_object_number, second_object_number):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelMenuBrowserPage.NAME_BOX_DROPDOWN_BUTTON_CSS).click()

        name_box_items = self.get_elements_by_css(ExcelMenuBrowserPage.NAME_BOX_ITEMS_CSS)

        first_name_box_item_timestamp = self._get_timestamp_of_name_box_item(name_box_items, first_object_number)
        second_name_box_item_timestamp = self._get_timestamp_of_name_box_item(name_box_items, second_object_number)

        self.get_element_by_css(ExcelMenuBrowserPage.MODAL_DIV_CSS).click()

        return first_name_box_item_timestamp == second_name_box_item_timestamp

    def _get_timestamp_of_name_box_item(self, name_box_items, object_number):
        object_index = int(object_number) - 1

        name_box_item_name = name_box_items[object_index].text

        timestamp_index = name_box_item_name.rindex('_') + 1

        return name_box_item_name[timestamp_index:]

    def enable_use_of_keyboard_shortcuts(self):
        self.focus_on_excel_frame()

        self._click_on_main_menu_item(ExcelMenuBrowserPage.MAIN_MENU_INSERT_BUTTON_ID)
        self._click_on_main_menu_item(ExcelMenuBrowserPage.MAIN_MENU_HOME_BUTTON_ID)

    def _click_on_main_menu_item(self, menu_item):
        self.get_element_by_id(menu_item).click()

    def click_close_add_in_popup(self):
        self.focus_on_excel_frame()
        self.find_element_in_list_by_attribute(
            ExcelMenuBrowserPage.ADD_IN_POPUP_MODAL_BUTTONS, 'aria-label', 'Close'
        ).click()

    def click_enable_button(self):
        self.focus_on_add_in_frame()
        self.get_element_by_id(ExcelMenuBrowserPage.ENABLE_BUTTON_ID).click()
