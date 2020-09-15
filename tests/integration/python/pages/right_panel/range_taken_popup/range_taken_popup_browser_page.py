from framework.pages_base.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class RangeTakenPopupBrowserPage(BaseBrowserPage):
    RANGE_TAKEN_OK_BUTTON = '.range-taken-popup-footer-buttons .primary'
    RANGE_TAKEN_CANCEL_BUTTON = '.range-taken-popup-footer-buttons .basic'
    RANGE_TAKEN_ACTIVE_CELL_OPTION = 'active_cell'

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
