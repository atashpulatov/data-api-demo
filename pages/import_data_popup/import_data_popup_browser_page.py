from pages.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_browser_page import RightPanelBrowserPage


class ImportDataPopupBrowserPage(BaseBrowserPage):
    MY_LIBRARY_SWITCH_ELEM = '''div[aria-label='My Library']'''
    ARIA_CHECKED_ATTRIBUTE = 'aria-checked'

    SEARCH_BAR_ELEM = '.search-field__input'

    NAME_OBJECT_ELEM = '''span[title='%s']'''

    IMPORT_BUTTON_ELEM = 'import'
    PREPARE_BUTTON_ELEM = 'prepare'

    NOTIFICATION_TEXT_ELEM = '.selection-title'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'

    ADD_TO_LIBRARY_BUTTON = '.mstrd-PageNotification-buttonContainer > .mstrd-Button.mstrd-Button--primary'

    def __init__(self):
        super().__init__()

        self.right_panel_browser_page = RightPanelBrowserPage()

    def ensure_mylibrary_switch_is_off(self):
        self.focus_on_import_data_pop_up_frame()

        element = self.get_element_by_css(ImportDataPopupBrowserPage.MY_LIBRARY_SWITCH_ELEM)

        if self._is_on(element):
            element.click()

    def _is_on(self, element):
        return element.get_attribute(ImportDataPopupBrowserPage.ARIA_CHECKED_ATTRIBUTE) == 'true'

    def find_and_select_object(self, object_name):
        self.focus_on_import_data_pop_up_frame()

        search_box = self.get_element_by_css(ImportDataPopupBrowserPage.SEARCH_BAR_ELEM)
        search_box.send_keys(object_name)

        self.get_element_by_css(ImportDataPopupBrowserPage.NAME_OBJECT_ELEM % object_name).click()

    def click_import_button(self):
        self.get_element_by_id(ImportDataPopupBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_browser_page.wait_for_import_to_finish_successfully()

    def click_import_button_to_import_with_error(self, error_message):
        self.get_element_by_id(ImportDataPopupBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_browser_page.wait_for_operation_error_and_accept(error_message)

    def click_import_button_to_open_import_dossier(self):
        self.get_element_by_id(ImportDataPopupBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.pause(25)  # TODO check if loaded

    def click_prepare_data_button(self):
        self.get_element_by_id(ImportDataPopupBrowserPage.PREPARE_BUTTON_ELEM).click()

        self.wait_for_element_to_have_attribute_value_by_css(
            ImportDataPopupBrowserPage.NOTIFICATION_TEXT_ELEM,
            ImportDataPopupBrowserPage.TEXT_CONTENT_ATTRIBUTE,
            ImportDataPopupBrowserPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT
        )

    def add_dossier_to_library(self):
        if self.check_if_element_exists_by_css(ImportDataPopupBrowserPage.ADD_TO_LIBRARY_BUTTON, timeout=5):
            self.get_elements_by_css(ImportDataPopupBrowserPage.ADD_TO_LIBRARY_BUTTON).click()