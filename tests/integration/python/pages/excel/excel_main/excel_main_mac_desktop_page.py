from pages_base.base_mac_desktop_page import BaseMacDesktopPage
from util.config_util import ConfigUtil
from util.const import DEFAULT_WAIT_BETWEEN_CHECKS
from util.exception.MstrException import MstrException
from util.util import Util


class ExcelMainMacDesktopPage(BaseMacDesktopPage):
    NEW_BLANK_WORKBOOK_ELEM = BaseMacDesktopPage.EXCEL_APP_ELEM + "/AXWindow[@AXTitle='Open new and recent files' " \
                                                                  "and @AXIdentifier='DocStage' and @AXSubrole=" \
                                                                  "'AXStandardWindow']/AXScrollArea[0]/AXList" \
                                                                  "[@AXSubrole='AXCollectionList']/AXList[@AXSubrole=" \
                                                                  "'AXSectionList']/AXGroup[@AXIdentifier=" \
                                                                  "'DocsUITemplate']/AXButton[@AXTitle=" \
                                                                  "'Blank Workbook']"

    GROUPS_OF_MY_ADD_INS_DROP_DOWN = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXScrollArea[0]/AXGroup[%s]"
    MY_ADD_INS_DROP_DOWN = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXScrollArea[0]/AXGroup[%s]/AXMenuButton"
    MY_ADD_INS_ITEM_ATTRIBUTE_NAME = 'AXTitle'
    MY_ADD_INS_ITEM_TITLE = 'My Add-ins'
    MY_ADD_INS_DROPDOWN_ARROW_OFFSET_X = 93
    MY_ADD_INS_DROPDOWN_ARROW_OFFSET_Y = 20

    ADD_IN_MENU_ELEMS = BaseMacDesktopPage.EXCEL_APP_ELEM + "/AXWindow[@AXTitle='My Add-ins' and @AXSubrole=" \
                                                            "'AXUnknown']/AXGroup[0]/AXGroup[0]/AXGroup[0]" \
                                                            "/AXRadioButton[@AXIdentifier=" \
                                                            "'popover_gallery_OfficeExtensionsGallery2_Control_0_%s']"
    ADD_IN_MENU_ELEM_ATTRIBUTE_NAME = 'AXDescription'

    def click_new_blank_workbook_elem(self):
        element = self.get_element_by_xpath(ExcelMainMacDesktopPage.NEW_BLANK_WORKBOOK_ELEM)
        Util.pause(0.5)
        element.click()

    def click_add_in_drop_down_elem(self):
        self._find_my_add_ins_dropdown().click(
            offset_x=self.MY_ADD_INS_DROPDOWN_ARROW_OFFSET_X,
            offset_y=self.MY_ADD_INS_DROPDOWN_ARROW_OFFSET_Y
        )

    def _find_my_add_ins_dropdown(self):
        groups_of_my_add_ins_drop_down_no = len(
            self.get_elements_by_xpath(ExcelMainMacDesktopPage.GROUPS_OF_MY_ADD_INS_DROP_DOWN)
        )

        for i in range(groups_of_my_add_ins_drop_down_no):
            element_candidate_xpath = ExcelMainMacDesktopPage.MY_ADD_INS_DROP_DOWN % i

            if self.check_if_element_exists_by_xpath(element_candidate_xpath, timeout=DEFAULT_WAIT_BETWEEN_CHECKS):
                element_candidate = self.get_element_by_xpath(element_candidate_xpath)

                title = element_candidate.get_attribute(ExcelMainMacDesktopPage.MY_ADD_INS_ITEM_ATTRIBUTE_NAME)
                if title == ExcelMainMacDesktopPage.MY_ADD_INS_ITEM_TITLE:
                    return element_candidate

        raise MstrException('My Add-ins dropdown not found.')

    def click_first_add_in_to_import_elem(self):
        self.find_element_by_attribute_in_elements_list_by_xpath(
            ExcelMainMacDesktopPage.ADD_IN_MENU_ELEMS,
            ExcelMainMacDesktopPage.ADD_IN_MENU_ELEM_ATTRIBUTE_NAME,
            ConfigUtil.get_excel_desktop_add_in_import_data_name()
        ).click()
