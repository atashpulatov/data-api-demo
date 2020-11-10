from pyperclip import paste
from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround
from framework.util.exception.MstrException import MstrException
from framework.util.message_const import MessageConst
from framework.util.util import Util
from pages.columns_and_filters_selection.columns_and_filters_selection_windows_desktop_page import \
    ColumnsAndFiltersSelectionWindowsDesktopPage


class ImportDataWindowsDesktopPage(BaseWindowsDesktopPage):
    MY_LIBRARY_SWITCH_ELEM = 'My Library'
    FILTERS_BUTTON_ELEM = 'Filters'

    SEARCH_ELEM = '//Group/Edit'

    ARIA_PROPERTIES_ATTRIBUTE = 'AriaProperties'
    ARIA_PROPERTIES_SEPARATOR = ';'
    ARIA_PROPERTY_SEPARATOR = '='
    ARIA_PROPERTY_CHECKED = 'checked'

    IMPORT_BUTTON_ELEM = 'Import'
    PREPARE_DATA_BUTTON_ELEM = 'Prepare Data'

    ERROR_MESSAGE_BUTTON_OK = 'OK'

    SHOW_DETAILS = 'show details'
    TABLE_DATAITEM_XPATH = '//Group/DataGrid/Group/Group/Table/DataItem/Text'  # TODO please add parent if possible

    ALLOW_ACCESS = 'Allow access'

    FIRST_OBJECT_ROW = '//Pane/Group/DataGrid/Group[2]/Group/ListItem[1]'

    TOOLTIP_XPATH = '//ToolTip[@Name]'  # TODO please add parent if possible

    ADD_TO_LIBRARY_BUTTON = '//Button[starts-with(@Name, \"Add to library\")]'  # TODO please add parent if possible
    POPUP_WINDOW_ELEM = 'NUIDialog'
    POPUP_CLOSE_BUTTON = 'Close'

    def __init__(self):
        super().__init__()

        self.columns_and_filters_selection_windows_desktop_page = ColumnsAndFiltersSelectionWindowsDesktopPage()
        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def ensure_mylibrary_switch_is_off(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        # TODO check if is on or ignore to have better performance?
        self.get_element_by_name(
            ImportDataWindowsDesktopPage.MY_LIBRARY_SWITCH_ELEM,
            image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.MY_LIBRARY_SWITCH_ELEM)
        ).click()

    def _is_on(self, element):
        aria_properties_value = self._get_element_aria_properties(element)

        aria_properties = aria_properties_value.split(ImportDataWindowsDesktopPage.ARIA_PROPERTIES_SEPARATOR)

        for property_value in aria_properties:
            property_on_off = property_value.split(ImportDataWindowsDesktopPage.ARIA_PROPERTY_SEPARATOR)
            if property_on_off[0] == ImportDataWindowsDesktopPage.ARIA_PROPERTY_CHECKED:
                return property_on_off[1]

        raise MstrException('Missing Aria property')

    def _get_element_aria_properties(self, element):
        return element.get_attribute(ImportDataWindowsDesktopPage.ARIA_PROPERTIES_ATTRIBUTE)

    def find_object(self, object_name):
        """
        Finds object by name. Name can be any identifying characteristic of the object (i.e. id, name).

        :param object_name: Object identifier, e.g. name or id.
        """
        self.windows_desktop_workaround.focus_on_popup_window()

        popup_main_element = self.get_add_in_main_element()

        search_element = popup_main_element.get_element_by_xpath(ImportDataWindowsDesktopPage.SEARCH_ELEM)

        # Remove search box content.
        search_element.send_keys((Keys.CONTROL, 'a', Keys.CONTROL, Keys.DELETE))

        if object_name:
            # Enter object_name.
            search_element.send_keys_with_check(object_name)

    def find_and_select_object(self, object_name):
        """
        Finds object by name and selects it.

        This method will be removed, see ImportDataBrowserPage#find_and_select_object.
        """

        self.find_and_select_object_by_id(object_name, object_name)

    def find_and_select_object_by_id(self, object_name, object_id):
        """
        Finds object by id and selects it, see ImportDataBrowserPage#find_and_select_object_by_id.
        """

        self.find_object(object_id)

        Util.pause(4)  # TODO wait when ready

        self.get_element_by_name(
            object_name,
            image_name=self.prepare_image_name(object_name)
        ).click()

    def click_import_button(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        self._click_import_button()

        self.windows_desktop_workaround.focus_on_right_side_panel()

        if not self.check_if_element_exists_by_name(MessageConst.IMPORT_SUCCESSFUL_TEXT):
            raise MstrException('Error while importing')

    def click_import_button_without_checking_results(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        self._click_import_button()

    def click_import_button_to_import_with_error(self, error_message):
        self.windows_desktop_workaround.focus_on_popup_window()

        self._click_import_button()

        if not self.check_if_element_exists_by_name(error_message):
            raise MstrException('Different notification displayed')

        self.get_element_by_name(
            ImportDataWindowsDesktopPage.ERROR_MESSAGE_BUTTON_OK,
            image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.ERROR_MESSAGE_BUTTON_OK)
        ).click()

    def click_import_button_to_open_import_dossier(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        self._click_import_button()

        # TODO check if dossier is opened

    def _click_import_button(self):
        self.get_element_by_name(
            ImportDataWindowsDesktopPage.IMPORT_BUTTON_ELEM,
            image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.IMPORT_BUTTON_ELEM)
        ).click()

    def click_prepare_data_button(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        self.get_element_by_name(
            ImportDataWindowsDesktopPage.PREPARE_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.PREPARE_DATA_BUTTON_ELEM)
        ).click()

    def add_dossier_to_library(self):
        # TODO use check_element if possible, when element not present get_element waits at least 60s
        try:
            self.get_element_by_xpath(
                ImportDataWindowsDesktopPage.ADD_TO_LIBRARY_BUTTON,
                image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.ADD_TO_LIBRARY_BUTTON)
            ).click()

        except MstrException:
            pass

    def show_object_details(self, object_number):
        self.windows_desktop_workaround.focus_on_popup_window()

        object_index = int(object_number) - 1

        elements = self.get_elements_by_name(ImportDataWindowsDesktopPage.SHOW_DETAILS)

        elements[object_index].click()

    def copy_object_details_to_clipboard_and_verify_if_correct(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        details_items = self.get_add_in_main_element().get_elements_by_xpath(
            ImportDataWindowsDesktopPage.TABLE_DATAITEM_XPATH
        )

        # details_items returns one item for the title and one item for the value.
        # Each value is at an odd-numbered index
        for details_value in details_items[1::2]:
            details_value.move_to_and_click()
            self.get_add_in_main_element().move_to()

            clipboard_content = paste()
            expected_value = details_value.text

            if clipboard_content != expected_value:
                self.log_warning(f'Error while checking Clipboard content, expected value: [{expected_value}], '
                                 f'Clipboard content: [{clipboard_content}]')
                return False

        return True

    def close_import_data_popup(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        self.get_element_by_name_using_parent(
            self.get_element_by_class_name, ImportDataWindowsDesktopPage.POPUP_WINDOW_ELEM,
            ImportDataWindowsDesktopPage.POPUP_CLOSE_BUTTON,
            image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.POPUP_CLOSE_BUTTON)
        ).click()

    def click_filters_button(self):
        self.get_element_by_name(
            ImportDataWindowsDesktopPage.FILTERS_BUTTON_ELEM,
            image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.FILTERS_BUTTON_ELEM)
        ).click()

    def hover_over_first_object_in_list(self):
        self.get_add_in_main_element().get_element_by_xpath(ImportDataWindowsDesktopPage.FIRST_OBJECT_ROW).move_to()

    def select_first_object_from_list(self):
        self.get_add_in_main_element().get_element_by_xpath(ImportDataWindowsDesktopPage.FIRST_OBJECT_ROW).click()

    def clear_search_box(self):
        self.find_object('')

    def hover_over_import_button(self):
        self.get_element_by_name(
            ImportDataWindowsDesktopPage.IMPORT_BUTTON_ELEM,
            image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.IMPORT_BUTTON_ELEM)
        ).move_to()

    def get_tooltip_message_for_button(self):
        return self.get_element_by_xpath(ImportDataWindowsDesktopPage.TOOLTIP_XPATH).get_name_by_attribute()
