from pages.base_page import BasePage


class ExcelMenuMacDesktopPage(BasePage):
    ADDIN_IN_HOME_TAB_TEXT_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and " \
                                  "@AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup/AXButton" \
                                  "[@AXTitle='Import Data']"

    PASTE_BUTTON = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole=" \
                   "'AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[0]/AXMenuButton[@AXTitle='Paste']"

    HOME_TAB_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole=" \
                    "'AXStandardWindow']/AXTabGroup[0]/AXRadioButton[@AXTitle='Home']"

    def click_add_in_elem(self):
        self._refocus_on_home_tab()
        self.click_element_by_xpath(ExcelMenuMacDesktopPage.ADDIN_IN_HOME_TAB_TEXT_ELEM)

    def _refocus_on_home_tab(self):
        try:
            self.get_visible_element_by_xpath(ExcelMenuMacDesktopPage.PASTE_BUTTON)
        except:
            self.get_visible_element_by_xpath(ExcelMenuMacDesktopPage.HOME_TAB_ELEM)
