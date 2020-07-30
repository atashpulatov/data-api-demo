from pyperclip import paste

# from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
from pages_base.base_browser_page import BaseBrowserPage


class FilterPanelBrowserPage(BaseBrowserPage):
    OWNER_ALL_PANEL = 'div.category-list-wrapper:nth-child(4) > button:nth-child(2)'

    def __init__(self):
        super().__init__()

    def click_owner_all_panel(self):
        self.get_element_by_css(
            FilterPanelBrowserPage.OWNER_ALL_PANEL).click()
