from pyperclip import paste

# from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
from pages_base.base_browser_page import BaseBrowserPage


class FilterPanelBrowserPage(BaseBrowserPage):
    OWNER_ALL_PANEL = 'div.category-list-wrapper:nth-child(4) > button:nth-child(2)'
    SELECT_ALL_WITHIN_ALL_PANEL = 'button.all-panel__button:nth-child(1)'
    CLICK_ELEMENT_FROM_CATEGORY = '.category-list-header[aria-label="%s"] + .category-list-table label[title="%s"]'

    def __init__(self):
        super().__init__()

    def click_owner_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.OWNER_ALL_PANEL).click()

    def click_select_all_within_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.SELECT_ALL_WITHIN_ALL_PANEL).click()

    def click_select_all_within_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.SELECT_ALL_WITHIN_ALL_PANEL).click()

    def click_element_from_list(self, category, element):
        self.get_element_by_css(FilterPanelBrowserPage.CLICK_ELEMENT_FROM_CATEGORY % (category, element)).click()
