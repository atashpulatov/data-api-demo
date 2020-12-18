from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_windows_desktop_page import RightPanelTileWindowsDesktopPage


class ColumnsAndFiltersSelectionWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_BUTTON = 'import'
    BACK_BUTTON = 'back'
    DATA_PREVIEW_BUTTON = 'data-preview'
    CLOSE_PREVIEW_BUTTON = 'Close Preview'
    CANCEL_BUTTON = 'cancel'

    BUTTONS_SELECTORS = {
        'Import': IMPORT_BUTTON,
        'Data Preview': DATA_PREVIEW_BUTTON,
        'Cancel': CANCEL_BUTTON,
    }

    POPUP_WINDOW_ELEM = 'NUIDialog'
    POPUP_CLOSE_BUTTON = 'Close'

    TOTALS_AND_SUBTOTALS = 'Include Subtotals and Totals'
    TOTALS_AND_SUBTOTALS_SWITCH = '//Text[@Name="%s"]' % TOTALS_AND_SUBTOTALS

    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'
    POPUP_WINDOW_TITLE = '//Group[@AutomationId="popup-wrapper"]/Text[@Name="%s"]'

    SEARCH_INPUT = 'Search...'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_windows_desktop_page = RightPanelTileWindowsDesktopPage()

    def ensure_columns_and_filters_selection_is_visible(self):
        is_visible = self.check_if_element_exists_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT,
            image_name=self.prepare_image_name(
                ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT
            )
        )

        if not is_visible:
            raise MstrException('Error while opening Attributes Metrics Filters.')

    def ensure_popup_title_is_correct(self, title):
        popup_title = self.get_add_in_main_element().get_element_by_xpath(
            ColumnsAndFiltersSelectionWindowsDesktopPage.POPUP_WINDOW_TITLE % title
        )

        if not popup_title:
            raise MstrException(f'Popup title does not match given title, expected title: [{title}].')

    def search_for_element(self, element_name):
        search_input = self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.SEARCH_INPUT
        )

        search_input.click()

        search_input.send_keys(element_name)

    def clear_element_search_with_backspace(self):
        search_input = self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.SEARCH_INPUT
        )

        search_input.click()

        search_input.send_keys(Keys.CONTROL + 'a')
        search_input.send_keys(Keys.CONTROL)
        search_input.send_keys(Keys.BACKSPACE)

    def click_import_button(self):
        self.click_import_button_without_success_check()
        self.right_panel_tile_windows_desktop_page.wait_for_import_object_to_finish_successfully()

    def click_import_button_to_duplicate(self):
        self.click_import_button_without_success_check()
        self.right_panel_tile_windows_desktop_page.wait_for_duplicate_object_to_finish_successfully()

    def click_import_button_without_success_check(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON)
        ).click()

    def click_back_button(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.BACK_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.BACK_BUTTON)
        ).click()

    def click_cancel_button(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.CANCEL_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.CANCEL_BUTTON)
        ).click()

    def close_popup_window(self):
        self.get_element_by_name_using_parent(
            self.get_element_by_class_name, ColumnsAndFiltersSelectionWindowsDesktopPage.POPUP_WINDOW_ELEM,
            ColumnsAndFiltersSelectionWindowsDesktopPage.POPUP_CLOSE_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.POPUP_CLOSE_BUTTON)
        ).click()

    def click_include_totals_and_subtotals(self):
        # Need to move and click because Totals and Subtotals Switch element xpath is the same as
        # for View Selected Switch.
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionWindowsDesktopPage.TOTALS_AND_SUBTOTALS_SWITCH,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.TOTALS_AND_SUBTOTALS)
        ).move_to_and_click(offset_x=90, offset_y=2)

    def click_data_preview(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.DATA_PREVIEW_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.DATA_PREVIEW_BUTTON)
        ).click()

    def click_close_preview(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.CLOSE_PREVIEW_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.CLOSE_PREVIEW_BUTTON)
        ).click()

    def is_button_enabled(self, button_name):
        self._validate_button_name(button_name)

        button = self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.BUTTONS_SELECTORS[button_name]
        )

        return button.is_enabled_by_attribute()

    def _validate_button_name(self, button_name):
        supported_buttons_names = ColumnsAndFiltersSelectionWindowsDesktopPage.BUTTONS_SELECTORS.keys()

        if button_name not in supported_buttons_names:
            raise MstrException(
                f'Provided button name is not supported. Provided name: [{button_name}].'
                f'Supported names: [{supported_buttons_names}].')

    def is_back_button_visible(self):
        return self.check_if_element_exists_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.BACK_BUTTON,
            timeout=SHORT_TIMEOUT,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.BACK_BUTTON)
        )
