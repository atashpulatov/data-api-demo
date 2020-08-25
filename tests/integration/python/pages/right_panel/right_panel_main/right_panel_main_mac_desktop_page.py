from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage


class RightPanelMainMacDesktopPage(BaseMacDesktopPage):
    IMPORT_DATA_BUTTON_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXGroup[6]/AXButton[0]"
    ADD_DATA_BUTTON_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXButton[@AXTitle='Add Data' and @AXDOMIdentifier='add-data-btn']"

    DOTS_MENU = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXGroup[1]/AXButton[0]/AXGroup"

    CLEAR_DATA = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXGroup[2]/AXGroup[@AXSubrole='AXContentList']/AXMenuItem[@AXTitle='Clear Data']"
    CONFIFRM_CLEAR_DATA = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXGroup[2]/AXButton[@AXTitle='OK' and @AXDOMIdentifier='confirm-btn']"

    VIEW_DATA_BUTTON_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[3]/AXButton[0]"

    def click_import_data_button_element(self):
        self.get_element_by_xpath(RightPanelMainMacDesktopPage.IMPORT_DATA_BUTTON_ELEM).click()

    def click_add_data_button_element(self):
        self.get_element_by_xpath(RightPanelMainMacDesktopPage.ADD_DATA_BUTTON_ELEM).click()

    def clear_data(self):
        self._open_dots_menu()

        self.get_element_by_xpath(RightPanelMainMacDesktopPage.CLEAR_DATA).click()
        self.get_element_by_xpath(RightPanelMainMacDesktopPage.CONFIFRM_CLEAR_DATA).click()

    def view_data(self):
        self.get_element_by_xpath(RightPanelMainMacDesktopPage.VIEW_DATA_BUTTON_ELEM).click()
    
    def _open_dots_menu(self):
        #TODO: Function currently fails on the selector. This must be investigated
        
        if self.check_if_element_exists_by_xpath(RightPanelMainMacDesktopPage.DOTS_MENU, timeout=5):
           self.get_element_by_xpath(RightPanelMainMacDesktopPage.DOTS_MENU).click()

    def logout(self):
        pass