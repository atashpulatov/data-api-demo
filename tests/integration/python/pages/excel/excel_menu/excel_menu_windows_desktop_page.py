from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.config_util import ConfigUtil
from selenium.webdriver.common.keys import Keys
from pyperclip import paste
import re


class ExcelMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    NAME_BOX_ELEM = 'Name Box'

    def click_add_in_elem(self):
        import_data_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_name(
            import_data_name,
            image_name=self.prepare_image_name(import_data_name)
        ).click()

    def select_object_from_name_box(self, object_number):

        self._go_to_object_from_name_box(object_number)

        self.press_enter()

    def is_object_name_in_name_box_correct(self, object_number, object_name):
        """
        Navigates to the Name Box element and picks ListItem number object_number.
        Gets the name string and removes trailing digits from the name string.
        If the object_name string starts and ends with double quote removes quotations and
        return true if the name_from_namebox_without_timestamp is equal to object_name_without_quotes.

        If the object_name string doesn't starts and ends with double quote
        return true if the name_from_namebox_without_timestamp is equal to object_name

        :param object_number(int): Number of element from Name Box dropdown
        :param object_name(string): Name of object that we expect

        :returns (bloean): Returns true if string from Name box and object_name variable is equal
        """

        self._go_to_object_from_name_box(object_number)

        name_from_namebox = self._get_highlighted_string()

        name_from_namebox_without_timestamp = re.sub(r'\d+$', '', name_from_namebox)

        if object_name.startswith('"') and object_name.endswith('"'):
            object_name_without_quotes = object_name[1:-1]
            return object_name_without_quotes == name_from_namebox_without_timestamp

        return object_name == name_from_namebox_without_timestamp

    def are_timestamps_different(self, object_number_1, object_number_2):
        """
        Navigates to the Name Box element number object_number_1 and gets the name string.
        Repeats this step for element number object_number_2.

        Compares the strings and return true if they are not equal.

        :param object_number_1(int): Number of first element from Name Box dropdown
        :param object_number_2(int): Number of second element from Name Box dropdown

        :returns (bolean): Returns true if names of objects are different
        """

        self._go_to_object_from_name_box(object_number_1)
        name_1_from_namebox = self._get_highlighted_string()

        self._go_to_object_from_name_box(object_number_2)
        name_2_from_namebox = self._get_highlighted_string()

        return name_1_from_namebox != name_2_from_namebox

    def _go_to_object_from_name_box(self, object_number):
        self.get_element_by_name(
          ExcelMenuWindowsDesktopPage.NAME_BOX_ELEM
        ).click()

        for i in range(int(object_number)):
            self.press_down_arrow()

    def _get_highlighted_string(self):
        '''
        Copy and paste highlighted content. Returns pasted string.

        :returns (str): String containing highlighted text
        '''
        self.send_keys(Keys.CONTROL + 'c')
        self.send_keys(Keys.CONTROL)
        clipboard_content = paste()

        return clipboard_content
