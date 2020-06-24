from pages.base_page import BasePage
from util.util import Util


class ImportDataPopupMacDesktopPage(BasePage):
    MY_LIBRARY_SWITCH_ELEMS = [
        ("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole="
         "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/"
         "AXGroup[0]/AXGroup[0]/AXCheckBox[@AXSubrole='AXSwitch']"),
        ("/AXApplication[@AXTitle='Microsoft Excel']/"
         "AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/"
         "AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXGroup[0]/AXCheckBox[@AXSubrole='AXSwitch']")
    ]

    MY_LIBRARY_SWITCH_VALUE_ATTR = 'AXValue'
    MY_LIBRARY_SWITCH_VALUE_ATTR_ON_VALUE = '1'

    SEARCH_BAR_ELEMS = [
        ("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole="
         "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/"
         "AXGroup[0]/AXGroup[3]/AXTextField[0]"),
        ("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole="
         "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXGroup[3]/AXTextField[0]")
    ]

    NAME_HEADER_ELEMS = [
        ("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole="
         "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/"
         "AXGroup[0]/AXStaticText[@AXValue='Import Data']"),
        ("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole="
         "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[2]/AXTable[0]/AXRow[0]/"
         "AXCell[1]/AXGroup[0]/AXStaticText[@AXValue='Name']")
    ]

    IMPORT_BUTTON_ELEMS = [
        ("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole="
         "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/"
         "AXGroup[3]/AXButton[@AXTitle='Import' and @AXDOMIdentifier='import']"),
        ("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9'"
         " and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/"
         "AXButton[@AXTitle='Import' and @AXDOMIdentifier='import']")
    ]

    X_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT = 100
    Y_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT = 130

    def ensure_mylibrary_switch_is_off(self):
        element = self.get_element_by_xpath_list(ImportDataPopupMacDesktopPage.MY_LIBRARY_SWITCH_ELEMS)

        if self._is_on(element):
            element.click()

    def _is_on(self, element):
        value = element.get_attribute(ImportDataPopupMacDesktopPage.MY_LIBRARY_SWITCH_VALUE_ATTR)
        return value == ImportDataPopupMacDesktopPage.MY_LIBRARY_SWITCH_VALUE_ATTR_ON_VALUE

    def find_and_select_object(self, object_name):
        search_box = self.get_element_by_xpath_list(ImportDataPopupMacDesktopPage.SEARCH_BAR_ELEMS)
        search_box.send_keys(object_name)

        Util.pause(2)  # TODO wait when ready

        self.get_element_by_xpath_list(
            ImportDataPopupMacDesktopPage.NAME_HEADER_ELEMS
        ).click(
            offset_x=ImportDataPopupMacDesktopPage.X_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT,
            offset_y=ImportDataPopupMacDesktopPage.Y_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT
        )

    def click_import_button(self):
        self.get_element_by_xpath_list(ImportDataPopupMacDesktopPage.IMPORT_BUTTON_ELEMS).click()
