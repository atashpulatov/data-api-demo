from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_BUTTON = 'import'
    BACK_BUTTON = 'back'
    DATA_PREVIEW_BUTTON = 'data-preview'
    CANCEL_BUTTON = 'cancel'
    CLOSE_PREVIEW_BUTTON = 'Close Preview'

    TOTALS_AND_SUBTOTALS = 'Include Subtotals and Totals'
    TOTALS_AND_SUBTOTALS_SWITCH = '//Text[@Name="%s"]' % TOTALS_AND_SUBTOTALS

    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'

    SEARCH_INPUT = "Search..."

    def click_import_button(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON)
        ).click()

    def click_import_button_to_duplicate(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON)
        ).click()

    def ensure_columns_and_filters_selection_is_visible(self):
        element_coordinates = self.get_element_center_coordinates_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT,
            image_name=self.prepare_image_name(
                ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT)
        )

        if not element_coordinates:
            raise MstrException('Error while opening Attributes Metrics Filters')

    def click_back_button(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.BACK_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.BACK_BUTTON)
        ).click()

    def click_data_preview(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.DATA_PREVIEW_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.DATA_PREVIEW_BUTTON)
        ).click()

    def click_cancel_button(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.CANCEL_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.CANCEL_BUTTON)
        ).click()

    def click_close_preview(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.CLOSE_PREVIEW_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.CLOSE_PREVIEW_BUTTON)
        ).click()

    def click_include_totals_and_subtotals(self):
        # Need to move and click because Totals and Subtotals Switch element xpath is the same as
        # for View Selected Switch.
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionWindowsDesktopPage.TOTALS_AND_SUBTOTALS_SWITCH,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.TOTALS_AND_SUBTOTALS)
        ).move_to_and_click(offset_x=90, offset_y=2)

    def search_for_element(self, element_name):
        search_input = self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.SEARCH_INPUT,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.SEARCH_INPUT)
        )

        search_input.click()

        search_input.send_keys(element_name)

    def clear_element_search_with_backspace(self):
        search_input = self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.SEARCH_INPUT,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.SEARCH_INPUT)
        )

        search_input.click()

        search_input.send_keys(Keys.CONTROL + 'a')
        search_input.send_keys(Keys.CONTROL)
        search_input.send_keys(Keys.BACKSPACE)
