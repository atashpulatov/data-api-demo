from pages.base_windows_desktop_page import BaseWindowsDesktopPage
from pages.columns_and_filters_selection.columns_and_filters_selection_windows_desktop_page import \
    ColumnsAndFiltersSelectionWindowsDesktopPage
from util.exception.MstrException import MstrException
from util.util import Util


class ImportDataPopupWindowsDesktopPage(BaseWindowsDesktopPage):
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
        # TODO check if is on or ignore to have better performance?
        self.get_element_by_name(
            ImportDataPopupWindowsDesktopPage.MY_LIBRARY_SWITCH_ELEM,
            image_name=self.prepare_image_name(ImportDataPopupWindowsDesktopPage.MY_LIBRARY_SWITCH_ELEM)
        ).click()

    def _is_on(self, element):
        aria_properties_value = self._get_element_aria_properties(element)

        aria_properties = aria_properties_value.split(ImportDataPopupWindowsDesktopPage.ARIA_PROPERTIES_SEPARATOR)

        for property_value in aria_properties:
            property_on_off = property_value.split(ImportDataPopupWindowsDesktopPage.ARIA_PROPERTY_SEPARATOR)
            if property_on_off[0] == ImportDataPopupWindowsDesktopPage.ARIA_PROPERTY_CHECKED:
                return property_on_off[1]

        raise MstrException('Missing Aria property')

    def _get_element_aria_properties(self, element):
        return element.get_attribute(ImportDataPopupWindowsDesktopPage.ARIA_PROPERTIES_ATTRIBUTE)

    def find_and_select_object(self, object_name):
        search_box = self.get_element_by_name(ImportDataPopupWindowsDesktopPage.SEARCH_BAR_ELEM)
        search_box.send_keys(object_name)

        Util.pause(4)  # TODO wait when ready

        self.get_element_by_name(object_name, image_name=self.prepare_image_name(object_name)).click()

    def click_import_button(self):
        self.get_element_by_name(
            ImportDataPopupWindowsDesktopPage.IMPORT_BUTTON_ELEM,
            image_name=self.prepare_image_name(ImportDataPopupWindowsDesktopPage.IMPORT_BUTTON_ELEM)
        ).click()

        if not self.check_if_element_exists_by_name(ImportDataPopupWindowsDesktopPage.IMPORT_SUCCESSFUL_TEXT):
            raise MstrException('Error while importing')

    def click_import_button_to_open_import_dossier(self):
        self.get_element_by_name(
            ImportDataPopupWindowsDesktopPage.IMPORT_BUTTON_ELEM,
            image_name=self.prepare_image_name(ImportDataPopupWindowsDesktopPage.IMPORT_BUTTON_ELEM)
        ).click()

        self.pause(25)  # TODO check if loaded

    def click_prepare_data_button(self):
        self.get_element_by_name(
            ImportDataPopupWindowsDesktopPage.PREPARE_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(ImportDataPopupWindowsDesktopPage.PREPARE_DATA_BUTTON_ELEM)
        ).click()

        self.columns_and_filters_selection_windows_desktop_page.ensure_columns_and_filters_selection_is_visible()
