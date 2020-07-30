from pages_base.base_browser_page import BaseBrowserPage


class RightPanelBrowserPage(BaseBrowserPage):
    IMPORT_DATA_BUTTON_ELEM = '#overlay > div.side-panel > div.import-data > button'
    ADD_DATA_BUTTON_ELEM = 'add-data-btn'

    DOTS_MENU = '#overlay > div > div.header > div.settings > button > span > svg'
    DOTS_MENU_ITEM_LOG_OUT = 'logOut'

    SELECT_ALL_TILE = 'div.object-tile-container-header > span > span > '
    SELECT_ALL_TILE_CHECKBOX = '.checkmark'
    REFRESH_ALL = SELECT_ALL_TILE + 'button:nth-child(5)'
    REMOVE_ALL = SELECT_ALL_TILE + 'button:nth-child(6)'

    def click_import_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelBrowserPage.IMPORT_DATA_BUTTON_ELEM).click()

    def click_add_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RightPanelBrowserPage.ADD_DATA_BUTTON_ELEM).click()

    def logout(self):
        self.focus_on_add_in_frame()

        if self.check_if_element_exists_by_css(RightPanelBrowserPage.DOTS_MENU, timeout=5):
            self.get_element_by_css(RightPanelBrowserPage.DOTS_MENU).click()

            self.get_element_by_id(RightPanelBrowserPage.DOTS_MENU_ITEM_LOG_OUT).click()
    
    def refresh_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelBrowserPage.SELECT_ALL_TILE_CHECKBOX).click()

        self.get_element_by_css(RightPanelBrowserPage.REFRESH_ALL).click()

    def remove_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelBrowserPage.SELECT_ALL_TILE_CHECKBOX).click()

        self.get_element_by_css(RightPanelBrowserPage.REMOVE_ALL).click()
