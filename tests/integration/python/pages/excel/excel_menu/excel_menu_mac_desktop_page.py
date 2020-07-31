from pages_base.base_mac_desktop_page import BaseMacDesktopPage
from util.config_util import ConfigUtil


class ExcelMenuMacDesktopPage(BaseMacDesktopPage):
    ADD_IN_IN_HOME_TAB_TEXT_ELEM = "%s/AXScrollArea[0]/AXGroup/AXButton" \
                                   "[@AXTitle='%%s']" % BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM

    PASTE_BUTTON = "%s/AXScrollArea[0]/AXGroup[0]/AXMenuButton" \
                   "[@AXTitle='Paste']" % BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM

    HOME_TAB_ELEM = "%s/AXRadioButton[@AXTitle='Home']" % BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM
    INSERT_TAB_ELEM = "%s/AXRadioButton[@AXTitle='Insert']" % BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM
    TABLE_TAB_ELEM = "%s/AXRadioButton[@AXTitle='Table']" % BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM

    def click_add_in_elem(self):
        self._refocus_on_home_tab()

        import_data_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_xpath(ExcelMenuMacDesktopPage.ADD_IN_IN_HOME_TAB_TEXT_ELEM % import_data_name).click()

    def click_insert_tab_elem(self):
        self.get_element_by_xpath(ExcelMenuMacDesktopPage.INSERT_TAB_ELEM).click()

    def _refocus_on_home_tab(self):
        try:
            self.get_element_by_xpath(ExcelMenuMacDesktopPage.PASTE_BUTTON)
        except:
            self.get_element_by_xpath(ExcelMenuMacDesktopPage.HOME_TAB_ELEM)
