from pages.base_browser_page import BasePage
from util.util import Util


class ExcelMainMacDesktopPage(BasePage):
    NEW_BLANK_WORKBOOK_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Open new and recent " \
                              "files' and @AXIdentifier='DocStage' and @AXSubrole='AXStandardWindow']/" \
                              "AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXList[@AXSubrole=" \
                              "'AXSectionList']/AXGroup[@AXIdentifier='DocsUITemplate']/AXButton[@AXTitle=" \
                              "'Blank Workbook']"

    INSERT_TAB_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole=" \
                      "'AXStandardWindow']/AXTabGroup[0]/AXRadioButton[@AXTitle='Insert']"

    ADD_IN_DROP_DOWN = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole=" \
                      "'AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[3]/AXMenuButton[@AXTitle='My Add-ins']"

    ADD_IN_TO_IMPORT_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='My Add-ins' and @AXSubrole=" \
                           "'AXUnknown']/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXRadioButton[@AXIdentifier=" \
                           "'popover_gallery_OfficeExtensionsGallery2_Control_0_0']"

    def click_new_blank_workbook_elem(self):
        element = self.get_element_by_xpath(ExcelMainMacDesktopPage.NEW_BLANK_WORKBOOK_ELEM)
        Util.pause(0.5)
        element.click()

    def click_insert_tab_elem(self):
        self.get_element_by_xpath(ExcelMainMacDesktopPage.INSERT_TAB_ELEM).click()

    def click_add_in_drop_down_elem(self):
        self.get_element_by_xpath(ExcelMainMacDesktopPage.ADD_IN_DROP_DOWN).click(offset_x=93, offset_y=20)

    def click_first_add_in_to_import_elem(self):
        self.get_element_by_xpath(ExcelMainMacDesktopPage.ADD_IN_TO_IMPORT_ELEM).click()
