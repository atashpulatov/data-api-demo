from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.config_util import ConfigUtil


class ExcelMenuMacDesktopPage(BaseMacDesktopPage):
    ADD_IN_IN_HOME_TAB_TEXT_ELEM = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXScrollArea[0]/AXGroup/" \
                                                                                   "AXButton[@AXTitle='%s']"

    PASTE_BUTTON = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXScrollArea[0]/AXGroup[0]/" \
                                                                   "AXMenuButton[@AXTitle='Paste']"

    HOME_TAB_ELEM = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXRadioButton[@AXTitle='Home']"
    INSERT_TAB_ELEM = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXRadioButton[@AXTitle='Insert']"
    VIEW_TAB_ELEM = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXRadioButton[@AXTitle='View']"

    def click_add_in_elem(self):
        self._refocus_on_home_tab()

        import_data_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_xpath(ExcelMenuMacDesktopPage.ADD_IN_IN_HOME_TAB_TEXT_ELEM % import_data_name).click()

    def click_insert_tab_elem(self):
        self.get_element_by_xpath(ExcelMenuMacDesktopPage.INSERT_TAB_ELEM).click()

    def _refocus_on_home_tab(self):
        try:
            self.get_element_by_xpath(ExcelMenuMacDesktopPage.PASTE_BUTTON)
        except Exception:
            self.get_element_by_xpath(ExcelMenuMacDesktopPage.HOME_TAB_ELEM)
