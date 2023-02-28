import re

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.config_util import ConfigUtil
from framework.util.util import Util


class ExcelMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    ADD_IN_IN_HOME_TAB_TEXT_ELEM = '//Button[starts-with(@Name, "%s")]'
    TABLE_NAME_EDIT_XPATH = '//Edit[@Name="%s"]'

    MAIN_MENU_HOME_BUTTON_NAME = 'Home'
    MENU_BUTTON = 'Task Pane Options'
    MENU_BUTTON_WIDTH = 40
    MENU_BUTTONS_MARGIN = 20
    NAME_BOX_ELEM = 'Name Box'
    TABLE_NAME_ELEM = 'Table Name'

    def click_add_in_elem(self):
        add_in_environment = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_name(ExcelMenuWindowsDesktopPage.MAIN_MENU_HOME_BUTTON_NAME).click()

        self.get_element_by_xpath(
            ExcelMenuWindowsDesktopPage.ADD_IN_IN_HOME_TAB_TEXT_ELEM % add_in_environment,
            image_name=self.prepare_image_name(add_in_environment)
        ).click()

    def get_environment_id(self):
        """
        Gets environment id from Add-In name, used for preparing url for REST API calls.

        E.g. for current_env_RV_NNNNNN it's NNNNNN.

        :return: environment id.
        """
        add_in_environment = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        add_in_button = self.get_element_by_xpath(
            ExcelMenuWindowsDesktopPage.ADD_IN_IN_HOME_TAB_TEXT_ELEM % add_in_environment
        )
        add_in_name = add_in_button.get_name_by_attribute()

        return Util.extract_environment_id(add_in_environment, add_in_name)

    def click_close_add_in_button(self):
        # Close add-in button ('X') is not present in page source. Workaround is to find button next to this element
        # and move to the right.
        self.get_element_by_name(
            ExcelMenuWindowsDesktopPage.MENU_BUTTON
        ).move_to_and_click(
            offset_x=ExcelMenuWindowsDesktopPage.MENU_BUTTON_WIDTH + ExcelMenuWindowsDesktopPage.MENU_BUTTONS_MARGIN,
            offset_y=10
        )

    def select_object_from_name_box(self, object_number):
        self._go_to_object_from_name_box(object_number)

        self.press_enter()

    def change_table_name(self, new_table_name):
        self.get_element_by_xpath(
            ExcelMenuWindowsDesktopPage.TABLE_NAME_EDIT_XPATH % ExcelMenuWindowsDesktopPage.TABLE_NAME_ELEM
        ).click()

        self.send_keys(new_table_name)
        self.press_enter()

    def is_object_name_in_name_box_correct(self, object_number, expected_name):
        """
        Checks if object name in Object Box is correct ignoring trailing timestamp.

        :param expected_name(int): Number of element from Name Box dropdown to check name correctness.
        :param expected_name(string): Expected name of object.

        :return (boolean): Returns True if string in Name Box is correct, False otherwise.
        """

        self._go_to_object_from_name_box(object_number)

        name_from_namebox = self.get_selected_text_using_clipboard()
        name_from_namebox_without_timestamp = re.sub(r'_\d+$', '_', name_from_namebox)

        return expected_name == name_from_namebox_without_timestamp

    def are_timestamps_different(self, object_number_1, object_number_2):
        """
        Checks if timestamps in names of the given objects in the Name Box are different.

        :param object_number_1(int): Number of first element from Name Box dropdown.
        :param object_number_2(int): Number of second element from Name Box dropdown.

        :return (boolean): Returns True if names of objects are different, False otherwise.
        """

        self._go_to_object_from_name_box(object_number_1)
        name_1_from_namebox = self.get_selected_text_using_clipboard()

        self._go_to_object_from_name_box(object_number_2)
        name_2_from_namebox = self.get_selected_text_using_clipboard()

        return name_1_from_namebox != name_2_from_namebox

    def _go_to_object_from_name_box(self, object_number):
        self.get_element_by_name(
            ExcelMenuWindowsDesktopPage.NAME_BOX_ELEM
        ).click()

        for i in range(int(object_number)):
            self.press_down_arrow()

