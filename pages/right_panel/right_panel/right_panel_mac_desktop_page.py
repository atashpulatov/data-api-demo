from pages.base_page import BasePage


class RightPanelMacDesktopPage(BasePage):
    IMPORT_DATA_BUTTON_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/" \
                              "AXSplitGroup[0]/AXGroup[@AXTitle='MicroStrategy']/AXGroup[0]/AXGroup[0]/AXGroup[0]/" \
                              "AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='overlay']/AXGroup[6]/AXButton[0]"

    def click_import_data_button_element(self):
        # TODO doesn't work after right panel refactoring
        self.get_element_by_xpath(RightPanelMacDesktopPage.IMPORT_DATA_BUTTON_ELEM).click()
