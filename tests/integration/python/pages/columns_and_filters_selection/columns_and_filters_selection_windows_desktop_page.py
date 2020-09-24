from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_BUTTON = 'import'

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
