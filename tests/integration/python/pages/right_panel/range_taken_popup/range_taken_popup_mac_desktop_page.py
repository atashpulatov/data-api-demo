from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage


class RangeTakenPopupMacDesktopPage(BaseMacDesktopPage):
    CANCEL_BUTTON_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + \
                         "/AXGroup[@AXSubrole='AXApplicationDialog']/AXButton[1]"

    def click_cancel(self):
        self.get_element_by_xpath(RangeTakenPopupMacDesktopPage.CANCEL_BUTTON_ELEM).click()
