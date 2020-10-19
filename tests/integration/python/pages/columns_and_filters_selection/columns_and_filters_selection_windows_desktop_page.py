from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_BUTTON = 'import'
    BACK_BUTTON = 'back'
    DATA_PREVIEW_BUTTON = 'data-preview'
    CANCEL_BUTTON = 'cancel'
    CLOSE_PREVIEW_BUTTON = 'Close Preview'
    TOTALS_AND_SUBTOTALS_SWITCH = '//Text[@Name="Include Subtotals and Totals"]'
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'

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
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionWindowsDesktopPage.TOTALS_AND_SUBTOTALS_SWITCH,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.TOTALS_AND_SUBTOTALS_SWITCH)
        ).move_to_and_click(offset_x=90, offset_y=2)
        # need to move and click beacuse switch element xpath is the same like for View selected switch
