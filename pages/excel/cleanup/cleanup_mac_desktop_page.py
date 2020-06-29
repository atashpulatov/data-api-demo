from pages.base_page import BasePage
from util.util import Util


class CleanupMacDesktopPage(BasePage):
    EXCEL_IN_DOCK = "/AXApplication[@AXTitle='Dock']/AXList[0]/AXDockItem[@AXTitle='Microsoft Excel' and " \
                    "@AXSubrole='AXApplicationDockItem']"

    CONTEXT_MENU_QUIT_BUTTON = "/AXApplication[@AXTitle='Dock']/AXList[0]/AXDockItem/AXMenu[0]/AXMenuItem[@AXTitle=" \
                               "'Quit' or @AXTitle='Force Quit']"

    DONT_SAVE_BUTTON_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXDialog']/AXButton" \
                            "[@AXTitle='Don't Save']"

    def clean_up_after_each_test(self):
        self.get_element_by_xpath(CleanupMacDesktopPage.EXCEL_IN_DOCK).right_click()

        self.get_element_by_xpath(CleanupMacDesktopPage.CONTEXT_MENU_QUIT_BUTTON).click()
        self.get_element_by_xpath(CleanupMacDesktopPage.DONT_SAVE_BUTTON_ELEM).click()

        Util.pause(3)
