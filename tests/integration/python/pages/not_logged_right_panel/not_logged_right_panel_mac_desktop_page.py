from pages_base.base_mac_desktop_page import BaseMacDesktopPage


class NotLoggedRightPanelMacDesktopPage(BaseMacDesktopPage):
    OPEN_LOGIN_POPUP_BUTTON_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXGroup[0]/AXButton" \
                                                                              "[@AXDOMIdentifier='login-btn']"

    def enable_windows_desktop_workaround_if_needed(self):
        pass

    def click_open_login_pop_up_button(self):
        self.get_element_by_xpath(NotLoggedRightPanelMacDesktopPage.OPEN_LOGIN_POPUP_BUTTON_ELEM).click()
