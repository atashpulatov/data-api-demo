from pyperclip import paste

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class ImportDataBrowserPage(BaseBrowserPage):
    MY_LIBRARY_SWITCH_ELEM = '''div[aria-label='My Library']'''
    ARIA_CHECKED_ATTRIBUTE = 'aria-checked'
    ARIA_SORT_ATTRIBUTE = 'aria-sort'

    SEARCH_BAR_ELEM = '.search-field__input'
    CLEAR_SEARCH_BAR = '.search-field__clear-button'

    NAME_OBJECT_ELEM = '''span[title='%s']'''
    NAME_OBJECT_ID_PREFIX = '#name-column-'

    EXPAND_DETAILS_ELEM = '.details-indicator'
    OBJECT_DETAILS_TABLE = '.details-table > table tr'
    OBJECT_DETAILS_VALUE = '.tooltip :last-child'
    OBJECT_DETAIL_SELECTORS = {
        'type': '.details-table tr:nth-child(1) p',
        'id': '.details-table tr:nth-child(2) p',
        'created': '.details-table tr:nth-child(3) p',
        'location': '.details-table tr:nth-child(4) .ellipsis-container',
        'description': '.details-table tr:nth-child(5) .ellipsis-container'
    }

    IMPORT_BUTTON_ELEM = 'import'
    IMPORT_BUTTON_DISABLED = 'disabled'
    PREPARE_BUTTON_ELEM = 'prepare'

    NOTIFICATION_TEXT_ELEM = '.selection-title'
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'

    ADD_TO_LIBRARY_BUTTON = '.mstrd-PageNotification-buttonContainer > .mstrd-Button--primary'
    ADD_TO_LIBRARY_BUTTON_TEXT = 'Add to Library'
    ADD_TO_LIBRARY_BUTTON_SEARCH_TIMEOUT = 5

    CLOSE_IMPORT_DATA_BUTTON = '.popup-buttons > button'
    FILTERS_BUTTON = '.filter-button'
    FILTERS_SELECTED_NUMBER = '.filters-selected'

    FIRST_OBJECT_ROW = '.ReactVirtualized__Table__row'
    FIRST_OBJECT_ROW_SELECTED = '.ReactVirtualized__Table__row.selected-object'
    DISABLED_BUTTON_TOOLTIP = '.ant-popover-inner-content'

    COLUMN_HEADER = '''div[aria-label='%s']'''
    BUTTON_TOOLTIP = '.ant-popover-inner-content'

    ATTRIBUTE_METRIC_SELECTOR_ITEM_CSS = '.mstrmojo-FilterBox .item-wrapper'

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
        """
        Finds object by name. Name can be any identifying characteristic of the object (i.e. id, name).

        :param object_name: Object name or id.
        """

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

        self.select_object_by_name(object_name)

    def select_object_by_name(self, object_name):
        """
        Select object by name on the displayed objects list. This method does not verify ids and cannot handle
        all special characters.

        :param object_name: object name to search for
        """
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

    def click_import_button(self, not_used_reset_framework_method, not_used_context):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully()

    def click_import_button_without_checking_results(self):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

    def click_import_button_to_import_with_error(self, error_message):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_operation_error_and_accept(error_message)

    def click_import_button_to_import_with_global_error(self, error_message):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_operation_global_error_and_accept(error_message)

    def click_import_button_to_open_import_dossier(self):
        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).click()

    def is_prepare_data_button_enabled(self):
        element = self.get_element_by_id(ImportDataBrowserPage.PREPARE_BUTTON_ELEM)

        return element.is_enabled_by_attribute_html()

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
        self.focus_on_add_in_popup_frame()

        object_index = int(object_number) - 1

        self.get_elements_by_css(ImportDataBrowserPage.EXPAND_DETAILS_ELEM)[object_index].click()

    def copy_object_details_to_clipboard_and_verify_if_correct(self):
        details_rows = self.get_elements_by_css(ImportDataBrowserPage.OBJECT_DETAILS_TABLE)

        for row in details_rows:
            details_value = row.get_element_by_css(ImportDataBrowserPage.OBJECT_DETAILS_VALUE)
            details_value.click()

            clipboard_content = paste()
            expected_value = details_value.text

            if paste() != details_value.text:
                self.log_warning(f'Error while checking Clipboard content, expected value: [{expected_value}], '
                                 f'Clipboard content: [{clipboard_content}]')
                return False

        return True

    def get_object_detail_value(self, detail_type):
        self.focus_on_add_in_popup_frame()

        object_detail = self.get_elements_by_css(ImportDataBrowserPage.OBJECT_DETAIL_SELECTORS[detail_type])

        return object_detail[0].text

    def close_import_data_popup(self):
        self.get_element_by_css(ImportDataBrowserPage.CLOSE_IMPORT_DATA_BUTTON).click()

    def click_filters_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ImportDataBrowserPage.FILTERS_BUTTON).click()

    def hover_over_first_object_in_list(self):
        self.get_element_by_css(ImportDataBrowserPage.FIRST_OBJECT_ROW).move_to()

    def select_first_object_from_list(self):
        self.get_element_by_css(ImportDataBrowserPage.FIRST_OBJECT_ROW).click()

        first_object_selected = self.check_if_element_exists_by_css(
            ImportDataBrowserPage.FIRST_OBJECT_ROW_SELECTED,
            timeout=Const.SHORT_TIMEOUT
        )

        if not first_object_selected:
            raise MstrException('Error while selecting first object in the list.')

    def find_the_color_of_first_object_in_list(self):
        return self.get_element_by_css(ImportDataBrowserPage.FIRST_OBJECT_ROW).get_background_color()

    def verify_if_import_button_is_enabled(self):
        element = self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM)
        return element.get_attribute(ImportDataBrowserPage.IMPORT_BUTTON_DISABLED) is None

    def clear_search_box(self):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ImportDataBrowserPage.SEARCH_BAR_ELEM)
        search_box.clear()

    def click_column_header(self, header):
        self.get_element_by_css(ImportDataBrowserPage.COLUMN_HEADER % header).click()

    def get_column_header_sort_order(self, header):
        element = self.get_element_by_css(ImportDataBrowserPage.COLUMN_HEADER % header)
        return element.get_attribute(ImportDataBrowserPage.ARIA_SORT_ATTRIBUTE)

    def get_filters_number(self):
        return self.get_element_by_css(ImportDataBrowserPage.FILTERS_SELECTED_NUMBER).text

    def hover_over_import_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ImportDataBrowserPage.IMPORT_BUTTON_ELEM).move_to()

    def get_tooltip_message_for_button(self):
        self.focus_on_add_in_popup_frame()

        return self.get_element_by_css(ImportDataBrowserPage.BUTTON_TOOLTIP).text

    def scroll_objects_list_by_number_of_pages(self, number):
        for i in range(int(number)):
            self.press_page_down()

    def scroll_objects_list_to_end(self):
        self.press_end()

    def select_attribute_metric_selector_by_name(self, expected_selector_name):
        self.focus_on_dossier_frame()

        selectors = self.get_elements_by_css(ImportDataBrowserPage.ATTRIBUTE_METRIC_SELECTOR_ITEM_CSS)
        for selector in selectors:
            if selector.text == expected_selector_name:
                selector.click()
                return

        raise MstrException(f'Could not find selector with name: {expected_selector_name}')
