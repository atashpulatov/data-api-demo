from pages.base_page import BasePage


class NotLoggedRightPanelMacDesktopPage(BasePage):
    OPEN_LOGIN_POPUP_BUTTON_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and " \
                                   "@AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/" \
                                   "AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXButton[@AXDOMIdentifier=" \
                                   "'login-btn']"

    def click_open_login_pop_up_button(self):
        self.click_element_by_xpath(NotLoggedRightPanelMacDesktopPage.OPEN_LOGIN_POPUP_BUTTON_ELEM)
