from pages.base_page import BasePage
from pages.columns_and_filters_selection.columns_and_filters_selection_windows_desktop_page import \
    ColumnsAndFiltersSelectionWindowsDesktopPage
from util.util import Util


class ImportDataPopupWindowsDesktopPage(BasePage):
    MY_LIBRARY_SWITCH_ELEM = 'My Library'

    ARIA_PROPERTIES_ATTRIBUTE = 'AriaProperties'
    ARIA_PROPERTIES_SEPARATOR = ';'
    ARIA_PROPERTY_SEPARATOR = '='
    ARIA_PROPERTY_CHECKED = 'checked'

    SEARCH_BAR_ELEM = 'Search...'

    IMPORT_BUTTON_ELEM = 'Import'
    PREPARE_DATA_BUTTON_ELEM = 'Prepare Data'

    IMPORT_SUCCESSFUL_TEXT = 'Import successful'

    def __init__(self):
        super().__init__()
        self.columns_and_filters_selection_windows_desktop_page = ColumnsAndFiltersSelectionWindowsDesktopPage()

    def ensure_mylibrary_switch_is_off(self):
        self.click_element_by_name(ImportDataPopupWindowsDesktopPage.MY_LIBRARY_SWITCH_ELEM,
                                   image_name=self.prepare_image_name(
                                       ImportDataPopupWindowsDesktopPage.MY_LIBRARY_SWITCH_ELEM))

    def _is_on(self, element):
        aria_properties_value = self._get_element_aria_properties(element)

        aria_properties = aria_properties_value.split(ImportDataPopupWindowsDesktopPage.ARIA_PROPERTIES_SEPARATOR)

        for property_value in aria_properties:
            property_on_off = property_value.split(ImportDataPopupWindowsDesktopPage.ARIA_PROPERTY_SEPARATOR)
            if property_on_off[0] == ImportDataPopupWindowsDesktopPage.ARIA_PROPERTY_CHECKED:
                return property_on_off[1]

        raise Exception('Missing Aria property')

    def _get_element_aria_properties(self, element):
        return element.get_attribute(ImportDataPopupWindowsDesktopPage.ARIA_PROPERTIES_ATTRIBUTE)

    def find_and_select_object(self, object_name):
        search_box = self.get_visible_element_by_name(ImportDataPopupWindowsDesktopPage.SEARCH_BAR_ELEM)
        search_box.send_keys(object_name)

        Util.pause(4)  # TODO wait when ready

        self.click_element_by_name(object_name, image_name=self.prepare_image_name(object_name))

    def click_import_button(self):
        self.click_element_by_name(ImportDataPopupWindowsDesktopPage.IMPORT_BUTTON_ELEM,
                                   image_name=self.prepare_image_name(
                                       ImportDataPopupWindowsDesktopPage.IMPORT_BUTTON_ELEM))

        element_coordinates = self.check_element_by_name(ImportDataPopupWindowsDesktopPage.IMPORT_SUCCESSFUL_TEXT)

        if not element_coordinates:
            raise Exception('Error while importing')

    def click_prepare_data_button(self):
        self.click_element_by_name(ImportDataPopupWindowsDesktopPage.PREPARE_DATA_BUTTON_ELEM,
                                   image_name=self.prepare_image_name(
                                       ImportDataPopupWindowsDesktopPage.PREPARE_DATA_BUTTON_ELEM))

        self.columns_and_filters_selection_windows_desktop_page.ensure_columns_and_filters_selection_is_visible()
