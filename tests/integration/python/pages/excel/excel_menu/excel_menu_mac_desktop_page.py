from pages_base.base_page import BasePage
from util.config_util import ConfigUtil


class ExcelMenuMacDesktopPage(BasePage):
    ADD_IN_IN_HOME_TAB_TEXT_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and " \
                                   "@AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup/AXButton" \
                                   "[@AXTitle='%s']"

    PASTE_BUTTON = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole=" \
                   "'AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[0]/AXMenuButton[@AXTitle='Paste']"

    HOME_TAB_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole=" \
                    "'AXStandardWindow']/AXTabGroup[0]/AXRadioButton[@AXTitle='Home']"

    def click_add_in_elem(self):
        self._refocus_on_home_tab()

        import_data_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_xpath(ExcelMenuMacDesktopPage.ADD_IN_IN_HOME_TAB_TEXT_ELEM % import_data_name).click()

    def _refocus_on_home_tab(self):
        try:
            self.get_element_by_xpath(ExcelMenuMacDesktopPage.PASTE_BUTTON)
        except:
            self.get_element_by_xpath(ExcelMenuMacDesktopPage.HOME_TAB_ELEM)
