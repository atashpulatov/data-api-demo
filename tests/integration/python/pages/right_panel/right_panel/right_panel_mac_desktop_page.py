from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage


class RightPanelMacDesktopPage(BaseMacDesktopPage):
    IMPORT_DATA_BUTTON_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_OVERLAY_ELEM + "/AXGroup[6]/AXButton[0]"

    def click_import_data_button_element(self):
        self.get_element_by_xpath(RightPanelMacDesktopPage.IMPORT_DATA_BUTTON_ELEM).click()

    def logout(self):
        pass
