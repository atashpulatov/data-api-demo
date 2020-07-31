from pages_base.base_mac_desktop_page import BaseMacDesktopPage
from util.util import Util


class CleanupMacDesktopPage(BaseMacDesktopPage):
    MAC_DOCK = "/AXApplication[@AXTitle='Dock']/AXList[0]"

    EXCEL_IN_DOCK = "%s/AXDockItem[@AXTitle='Microsoft Excel' and @AXSubrole='AXApplicationDockItem']" % MAC_DOCK

    CONTEXT_MENU_QUIT_BUTTON = "%s/AXDockItem/AXMenu[0]/AXMenuItem[@AXTitle='Quit' or @AXTitle='Force Quit']" % MAC_DOCK

    DONT_SAVE_BUTTON_ELEM = "%s/AXWindow[@AXSubrole='AXDialog']/AXButton" \
                            "[@AXTitle='Don't Save']" % BaseMacDesktopPage.EXCEL_APP_ELEM

    def clean_up_after_each_test(self):
        self.get_element_by_xpath(CleanupMacDesktopPage.EXCEL_IN_DOCK).right_click()

        self.get_element_by_xpath(CleanupMacDesktopPage.CONTEXT_MENU_QUIT_BUTTON).click()
        self.get_element_by_xpath(CleanupMacDesktopPage.DONT_SAVE_BUTTON_ELEM).click()

        Util.pause(3)
