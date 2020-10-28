import re

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.config_util import ConfigUtil


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
