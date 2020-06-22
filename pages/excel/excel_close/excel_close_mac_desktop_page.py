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
        excel_in_dock_element = self.get_visible_element_by_xpath(CleanupMacDesktopPage.EXCEL_IN_DOCK)

        self.click_element_right_button(excel_in_dock_element)

        self.click_element_by_xpath(CleanupMacDesktopPage.CONTEXT_MENU_QUIT_BUTTON)
        self.click_element_by_xpath(CleanupMacDesktopPage.DONT_SAVE_BUTTON_ELEM)

        Util.pause(3)
