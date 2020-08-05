from framework.pages_base.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class DuplicateObjectPopupBrowserPage(BaseBrowserPage):
    DUPLICATE_POPUP_IMPORT_BUTTON = '#overlay > div.side-panel > div.object-tile-container > div.overlay-container > ' \
                                    'div.duplicate-popup > div.duplicate-popup-footer > div > button:nth-child(1)'

    DUPLICATE_POPUP_EDIT_BUTTON = '#overlay > div > div.object-tile-container > div.overlay-container > div > ' \
                                  'div.duplicate-popup-footer > div > button:nth-child(2)'

    DUPLICATE_POPUP_ACTIVE_CELL_OPTION = '#overlay > div.side-panel > div.object-tile-container > ' \
                                         'div.overlay-container > div.duplicate-popup > div.duplicate-popup-body > ' \
                                         'div.duplicate-popup-body-options > label:nth-child(1)'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def click_import(self):
        self.get_element_by_css(DuplicateObjectPopupBrowserPage.DUPLICATE_POPUP_IMPORT_BUTTON).click()

        self.right_panel_tile_browser_page.wait_for_duplicate_object_to_finish_successfully()

    def click_edit(self):
        self.get_element_by_css(DuplicateObjectPopupBrowserPage.DUPLICATE_POPUP_EDIT_BUTTON).click()

    def select_active_cell(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(DuplicateObjectPopupBrowserPage.DUPLICATE_POPUP_ACTIVE_CELL_OPTION).click()
