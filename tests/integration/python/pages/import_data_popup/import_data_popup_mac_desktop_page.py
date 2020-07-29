from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage
from pages_base.base_page import BasePage
from util.util import Util


class ImportDataPopupMacDesktopPage(BasePage):
    MY_LIBRARY_SWITCH_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/" \
                             "AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup" \
                             "[@AXDOMIdentifier='popup-wrapper']/AXGroup[0]/AXGroup[0]/" \
                             "AXCheckBox[@AXSubrole='AXSwitch']"

    MY_LIBRARY_SWITCH_VALUE_ATTR = 'AXValue'
    MY_LIBRARY_SWITCH_VALUE_ATTR_ON_VALUE = '1'

    SEARCH_BAR_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/" \
                      "AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup" \
                      "[@AXDOMIdentifier='popup-wrapper']/AXGroup[0]/AXGroup[3]/AXTextField[0]"

    NAME_HEADER_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/" \
                       "AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup" \
                       "[@AXDOMIdentifier='popup-wrapper']/AXGroup[2]/AXTable[0]/AXRow[0]/AXCell[1]/AXGroup[0]/" \
                       "AXStaticText[@AXValue='Name']"

    IMPORT_BUTTON_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/" \
                         "AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup" \
                         "[@AXDOMIdentifier='popup-wrapper']/AXGroup[3]/AXButton[@AXTitle='Import'"

    X_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT = 100
    Y_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT = 60

    def __init__(self):
        super().__init__()

        self.right_panel_tile_mac_desktop_page = RightPanelTileMacDesktopPage()

    def ensure_mylibrary_switch_is_off(self):
        element = self.get_element_by_xpath(ImportDataPopupMacDesktopPage.MY_LIBRARY_SWITCH_ELEM)

        if self._is_on(element):
            element.click()

    def _is_on(self, element):
        value = element.get_attribute(ImportDataPopupMacDesktopPage.MY_LIBRARY_SWITCH_VALUE_ATTR)
        return value == ImportDataPopupMacDesktopPage.MY_LIBRARY_SWITCH_VALUE_ATTR_ON_VALUE

    def find_and_select_object(self, object_name):
        search_box = self.get_element_by_xpath(ImportDataPopupMacDesktopPage.SEARCH_BAR_ELEM)
        search_box.send_keys(object_name)

        Util.pause(2)  # TODO wait when ready

        self.get_element_by_xpath(
            ImportDataPopupMacDesktopPage.NAME_HEADER_ELEM
        ).click(
            offset_x=ImportDataPopupMacDesktopPage.X_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT,
            offset_y=ImportDataPopupMacDesktopPage.Y_OFFSET_FROM_NAME_START_TO_FIRST_OBJECT
        )

    def click_import_button(self):
        self.get_element_by_xpath(ImportDataPopupMacDesktopPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_mac_desktop_page.wait_for_import_to_finish_successfully()
