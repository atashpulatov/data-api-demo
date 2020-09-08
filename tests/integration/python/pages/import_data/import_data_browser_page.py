from pyperclip import paste

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException
from framework.util.message_const import MessageConst
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class ImportDataBrowserPage(BaseBrowserPage):
    MY_LIBRARY_SWITCH_ELEM = '''div[aria-label='My Library']'''
    ARIA_CHECKED_ATTRIBUTE = 'aria-checked'

    SEARCH_BAR_ELEM = '.search-field__input'

    NAME_OBJECT_ELEM = '''span[title='%s']'''
    NAME_OBJECT_ID_PREFIX = '#name-column-'

    EXPAND_DETAILS_ELEM = '.details-indicator'
    OBJECT_DETAILS_TABLE = '.details-table > table tr'
    OBJECT_DETAILS_VALUE = '.tooltip :last-child'

    IMPORT_BUTTON_ELEM = 'import'
    PREPARE_BUTTON_ELEM = 'prepare'

    NOTIFICATION_TEXT_ELEM = '.selection-title'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'

    ADD_TO_LIBRARY_BUTTON = '.mstrd-PageNotification-buttonContainer > .mstrd-Button--primary'
    ADD_TO_LIBRARY_BUTTON_TEXT = 'Add to Library'
    ADD_TO_LIBRARY_BUTTON_SEARCH_TIMEOUT = 5

    CLOSE_IMPORT_DATA_BUTTON = '.popup-buttons > button'
    FILTERS_BUTTON = '.filter-button'

    FIRST_OBJECT_ROW = '.ReactVirtualized__Table__row'
    FIRST_OBJECT_ROW_SELECTED = '.ReactVirtualized__Table__row.selected-object'
    DISABLED_BUTTON_TOOLTIP = '.ant-popover-inner-content'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def ensure_mylibrary_switch_is_off(self):
        self.focus_on_add_in_popup_frame()

        element = self.get_element_by_css(ImportDataBrowserPage.MY_LIBRARY_SWITCH_ELEM)

        if self._is_on(element):
            element.click()

    def ensure_mylibrary_switch_is_on(self):
        self.focus_on_add_in_popup_frame()

        element = self.get_element_by_css(ImportDataBrowserPage.MY_LIBRARY_SWITCH_ELEM)

        if not self._is_on(element):
            element.click()

    def _is_on(self, element):
        return element.get_attribute(ImportDataBrowserPage.ARIA_CHECKED_ATTRIBUTE) == 'true'

    def find_object(self, object_name):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ImportDataBrowserPage.SEARCH_BAR_ELEM)
        search_box.send_keys_with_check(object_name)

    def find_and_select_object(self, object_name):
        """
        Finds object by name and selects it. This method does not verify ids and cannot handle all special characters.

        This method will be removed, please use find_and_select_object_by_id() instead.

        :param object_name: object name to search for
        """
        self.find_object(object_name)

        self.get_element_by_css(ImportDataBrowserPage.NAME_OBJECT_ELEM % object_name).click()

    def find_and_select_object_by_id(self, object_name, object_id):
        """
        Finds object by id and selects it.

        object_id is used for searching and object_name is used for verification if id is valid, if not MstrException
        is being raised (element not present).

        Searching for text (element.text) ensures special characters compatibility.

        :param object_name: object name to verify if object_id is valid
        :param object_id: object id to search for
        """
        self.find_object(object_id)

        name_object_selector = ImportDataBrowserPage.NAME_OBJECT_ID_PREFIX + object_id

        name_object = self.find_element_in_list_by_text(name_object_selector, object_name)
        name_object.click()

    def click_import_button(self):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully()

    def click_import_button_without_checking_results(self):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

    def click_import_button_to_import_with_error(self, error_message):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_operation_error_and_accept(error_message)

    def click_import_button_to_open_import_dossier(self):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

    def click_prepare_data_button(self):
        self.get_element_by_id(ImportDataBrowserPage.PREPARE_BUTTON_ELEM).click()

    def add_dossier_to_library(self):
        self.focus_on_dossier_frame()
        add_to_library_button = self.find_element_by_text_in_elements_list_by_css_safe(
            ImportDataBrowserPage.ADD_TO_LIBRARY_BUTTON,
            ImportDataBrowserPage.ADD_TO_LIBRARY_BUTTON_TEXT,
            timeout=ImportDataBrowserPage.ADD_TO_LIBRARY_BUTTON_SEARCH_TIMEOUT
        )

        if add_to_library_button:
            add_to_library_button.click()

    def show_object_details(self, object_number):
        object_index = int(object_number) - 1

        self.get_elements_by_css(ImportDataBrowserPage.EXPAND_DETAILS_ELEM)[object_index].click()

    def copy_object_details_to_clipboard_and_verify_if_correct(self):
        details_rows = self.get_elements_by_css(ImportDataBrowserPage.OBJECT_DETAILS_TABLE)

        for row in details_rows:
            details_value = row.get_element_by_css(ImportDataBrowserPage.OBJECT_DETAILS_VALUE)
            details_value.click()

            if paste() != details_value.text:
                return False

        return True

    def close_import_data_popup(self):
        self.get_element_by_css(ImportDataBrowserPage.CLOSE_IMPORT_DATA_BUTTON).click()

    def click_filters_button(self):
        self.get_element_by_css(ImportDataBrowserPage.FILTERS_BUTTON).click()

    def hover_over_first_object_in_list(self):
        self.get_element_by_css(ImportDataBrowserPage.FIRST_OBJECT_ROW).move_to()

    def select_first_object_from_list(self):
        self.get_element_by_css(ImportDataBrowserPage.FIRST_OBJECT_ROW).click()

        first_object_selected = self.check_if_element_exists_by_css(
            ImportDataBrowserPage.FIRST_OBJECT_ROW_SELECTED,
            timeout=SHORT_TIMEOUT
        )

        if not first_object_selected:
            raise MstrException('Error while selecting first object in the list.')

    def find_the_color_of_first_object_in_list(self):
        element = self.get_element_by_css(ImportDataBrowserPage.FIRST_OBJECT_ROW)

        return element.get_background_color()

    def verify_if_import_button_is_disabled(self):
        element = self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM)

        element.move_to()

        self.wait_for_element_to_have_attribute_value_by_css(
            ImportDataBrowserPage.DISABLED_BUTTON_TOOLTIP,
            ImportDataBrowserPage.TEXT_CONTENT_ATTRIBUTE,
            MessageConst.UNPUBLISHED_CUBE_CANNOT_BE_IMPORTED
        )

    def clear_search_box(self):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ImportDataBrowserPage.SEARCH_BAR_ELEM)
        search_box.clear()
