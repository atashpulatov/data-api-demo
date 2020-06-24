from pages.base_page import BasePage


class RightPanelMacDesktopPage(BasePage):
    IMPORT_DATA_BUTTON_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/" \
                              "AXSplitGroup/AXGroup/AXGroup/AXGroup/AXGroup/AXScrollArea/AXWebArea/AXButton"

    def click_import_data_button_element(self):
        # TODO doesn't work after right panel refactoring
        self.get_element_by_xpath(RightPanelMacDesktopPage.IMPORT_DATA_BUTTON_ELEM).click()
