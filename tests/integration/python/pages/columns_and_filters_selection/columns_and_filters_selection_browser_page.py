from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import LONG_TIMEOUT, SHORT_TIMEOUT, TEXT_CONTENT_ATTRIBUTE
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class ColumnsAndFiltersSelectionBrowserPage(BaseBrowserPage):
    CLOSE_POPUP = '#WACDialogTitlePanel > a'

    DATA_PREVIEW_BUTTON = '#data-preview'
    CLOSE_PREVIEW_TEXT = 'Close Preview'

    ANT_BUTTON = '.ant-btn'

    IMPORT_BUTTON_ELEM = 'import'
    BACK_BUTTON_ELEM = 'back'
    CANCEL_BUTTON_ELEM = 'cancel'

    NOTIFICATION_TEXT_ELEM = '.selection-title'
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'
    REPORT_TITLE = '.folder-browser-title > span:nth-child(2)'

    SEARCH_INPUT = '.search-input > input'

    SUBTOTALS_TOGGLE_CONTAINER = '.subtotal-container'
    SUBTOTALS_TOGGLE = SUBTOTALS_TOGGLE_CONTAINER + ' button.ant-switch'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def ensure_columns_and_filters_selection_is_visible(self):
        self.focus_on_add_in_popup_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            ColumnsAndFiltersSelectionBrowserPage.NOTIFICATION_TEXT_ELEM,
            TEXT_CONTENT_ATTRIBUTE,
            ColumnsAndFiltersSelectionBrowserPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT
        )

    def ensure_popup_title_is_correct(self, title):
        self.wait_for_element_to_have_attribute_value_by_css(
            ColumnsAndFiltersSelectionBrowserPage.REPORT_TITLE,
            TEXT_CONTENT_ATTRIBUTE,
            title
        )

    def search_for_element(self, element_name):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.send_keys_with_check(element_name)

    def clear_search_element(self):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.clear()

    def clear_element_search_with_backspace(self):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.click()

        while search_box.get_attribute("value") != '':
            self.press_right_arrow()
            self.press_backspace()

    def click_import_button_without_success_check(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.IMPORT_BUTTON_ELEM).click()

    def click_import_button(self):
        self.click_import_button_without_success_check()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully(timeout=LONG_TIMEOUT)

    def click_import_button_to_duplicate(self):
        self.click_import_button_without_success_check()

        self.right_panel_tile_browser_page.wait_for_duplicate_object_to_finish_successfully(timeout=LONG_TIMEOUT)

    def click_back_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.BACK_BUTTON_ELEM).click()

    def click_cancel_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.CANCEL_BUTTON_ELEM).click()

    def close_popup_window(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.CLOSE_POPUP).click()

    def click_include_totals_and_subtotals(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SUBTOTALS_TOGGLE).click()

    def click_data_preview(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.DATA_PREVIEW_BUTTON).click()

    def click_close_preview(self):
        self.focus_on_add_in_popup_frame()

        self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ANT_BUTTON,
            ColumnsAndFiltersSelectionBrowserPage.CLOSE_PREVIEW_TEXT
        ).click()

    def is_subtotal_visible(self):
        self.focus_on_add_in_popup_frame()

        return self.check_if_element_exists_by_css(
            ColumnsAndFiltersSelectionBrowserPage.SUBTOTALS_TOGGLE_CONTAINER,
            timeout=SHORT_TIMEOUT
        )
