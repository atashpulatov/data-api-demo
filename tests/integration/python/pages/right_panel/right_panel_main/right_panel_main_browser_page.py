from framework.pages_base.base_browser_page import BaseBrowserPage


class RightPanelMainBrowserPage(BaseBrowserPage):
    IMPORT_DATA_BUTTON_ELEM = '#overlay > div.side-panel > div.import-data > button'
    ADD_DATA_BUTTON_ELEM = 'add-data-btn'

    DOTS_MENU = '#overlay > div > div.header > div.settings > button > span > svg'
    DOTS_MENU_ITEM_LOG_OUT = 'logOut'

    SELECT_ALL_TILES = 'div.object-tile-container-header > span > span > '
    SELECT_ALL_TILES_CHECKBOX = '.checkmark'
    REFRESH_ALL = SELECT_ALL_TILES + 'button:nth-child(5)'
    REMOVE_ALL = SELECT_ALL_TILES + 'button:nth-child(6)'

    CLEAR_DATA = '.no-trigger-close.clear-data.not-linked-list'
    CONFIFRM_CLEAR_DATA = '#confirm-btn'
    VIEW_DATA = '#overlay > div > div.object-tile-container > div.overlay-container > div > button'

    def click_import_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.IMPORT_DATA_BUTTON_ELEM).click()

    def click_add_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RightPanelMainBrowserPage.ADD_DATA_BUTTON_ELEM).click()

    def logout(self):
        self.focus_on_add_in_frame()

        if self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU, timeout=5):
            self.get_element_by_css(RightPanelMainBrowserPage.DOTS_MENU).click()

            self.get_element_by_id(RightPanelMainBrowserPage.DOTS_MENU_ITEM_LOG_OUT).click()

    def refresh_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.SELECT_ALL_TILES_CHECKBOX).click()

        self.get_element_by_css(RightPanelMainBrowserPage.REFRESH_ALL).click()

    def remove_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.SELECT_ALL_TILES_CHECKBOX).click()

        self.get_element_by_css(RightPanelMainBrowserPage.REMOVE_ALL).click()

    def check_if_right_panel_is_empty(self):
        self.focus_on_add_in_frame()

        return self.check_if_element_exists_by_css(RightPanelMainBrowserPage.IMPORT_DATA_BUTTON_ELEM)


    def clear_data(self):
        self._open_dots_menu()

        self.get_element_by_css(RightPanelMainBrowserPage.CLEAR_DATA).click()
        self.get_element_by_css(RightPanelMainBrowserPage.CONFIFRM_CLEAR_DATA).click()

    def view_data(self):
      self.focus_on_add_in_frame()

      self.get_element_by_css(RightPanelMainBrowserPage.VIEW_DATA).click()

    def _open_dots_menu(self):
        self.focus_on_add_in_frame()

        if self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU, timeout=5):
            self.get_element_by_css(RightPanelMainBrowserPage.DOTS_MENU).click()
