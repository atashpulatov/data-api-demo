from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage

from pages.base_browser_page import BaseBrowserPage


class RangeTakenPopupBrowserPage(BaseBrowserPage):
    RANGE_TAKEN_OK_BUTTON = 'div.range-taken-popup-footer > div > button.button.primary'
    RANGE_TAKEN_CANCEL_BUTTON = 'div.range-taken-popup-footer > div > button.button.basic'
    RANGE_TAKEN_ACTIVE_CELL_OPTION = 'active_cell'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def click_ok(self):
        self.focus_on_add_in_frame()
        
        self.get_element_by_css(RangeTakenPopupBrowserPage.RANGE_TAKEN_OK_BUTTON).click()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully()

    def click_cancel(self):
        self.get_element_by_css(RangeTakenPopupBrowserPage.RANGE_TAKEN_CANCEL_BUTTON).click()

    def select_active_cell(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RangeTakenPopupBrowserPage.RANGE_TAKEN_ACTIVE_CELL_OPTION).click()
