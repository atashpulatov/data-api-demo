from framework.pages_base.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class RangeTakenPopupBrowserPage(BaseBrowserPage):
    RANGE_TAKEN_OK_BUTTON = '.base-popup-footer-buttons .mstr-rc-button--primary'
    RANGE_TAKEN_CANCEL_BUTTON = '.base-popup-footer-buttons .mstr-rc-button--secondary'
    RANGE_TAKEN_ACTIVE_CELL_OPTION = 'active_cell'
    NEW_SHEET_ELEMENT_ID = 'new_sheet'

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

    def is_new_sheet_selected(self):
        self.focus_on_add_in_frame()

        element = self.get_element_by_id(RangeTakenPopupBrowserPage.NEW_SHEET_ELEMENT_ID)

        return element.is_checked_by_attribute()
