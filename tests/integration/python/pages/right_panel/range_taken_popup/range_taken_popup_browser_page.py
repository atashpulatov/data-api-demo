from framework.pages_base.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


def _is_checked(element):
    return element.get_attribute(RangeTakenPopupBrowserPage.CHECKED_ATTRIBUTE) == 'true'


class RangeTakenPopupBrowserPage(BaseBrowserPage):
    RANGE_TAKEN_OK_BUTTON = '.range-taken-popup-footer-buttons .primary'
    RANGE_TAKEN_CANCEL_BUTTON = '.range-taken-popup-footer-buttons .basic'
    RANGE_TAKEN_ACTIVE_CELL_OPTION = 'active_cell'
    CHECKED_ATTRIBUTE = 'checked'
    NEW_SHEET_ELEMENT = 'new_sheet'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def click_ok(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RangeTakenPopupBrowserPage.RANGE_TAKEN_OK_BUTTON).click()

    def click_cancel(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RangeTakenPopupBrowserPage.RANGE_TAKEN_CANCEL_BUTTON).click()

    def select_active_cell(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RangeTakenPopupBrowserPage.RANGE_TAKEN_ACTIVE_CELL_OPTION).click()

    def verify_that_new_sheet_is_checked(self):
        self.focus_on_add_in_frame()
        element = self.get_element_by_id(RangeTakenPopupBrowserPage.NEW_SHEET_ELEMENT)
        return _is_checked(element)
