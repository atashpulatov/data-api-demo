from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage
from pages_base.base_mac_desktop_page import BaseMacDesktopPage
from util.util import Util


class ImportDataPopupMacDesktopPage(BaseMacDesktopPage):
    MY_LIBRARY_SWITCH_ELEM = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[0]/AXGroup[0]/" \
                                                                     "AXCheckBox[@AXSubrole='AXSwitch']"

    MY_LIBRARY_SWITCH_VALUE_ATTR = 'AXValue'
    MY_LIBRARY_SWITCH_VALUE_ATTR_ON_VALUE = '1'

    SEARCH_BAR_ELEM = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[0]/AXGroup[3]/AXTextField[0]"

    NAME_HEADER_ELEM = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[2]/AXTable[0]/AXRow[0]/AXCell[1]/" \
                                                               "AXGroup[0]/AXStaticText[@AXValue='Name']"

    IMPORT_BUTTON_ELEM = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[3]/AXButton[@AXTitle='Import'"

    PREPARE_BUTTON_ELEM = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[3]/AXButton[@AXTitle='Prepare Data']"

    FROM_NAME_START_TO_FIRST_OBJECT_OFFSET_X = 100
    FROM_NAME_START_TO_FIRST_OBJECT_OFFSET_Y = 60

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
            offset_x=ImportDataPopupMacDesktopPage.FROM_NAME_START_TO_FIRST_OBJECT_OFFSET_X,
            offset_y=ImportDataPopupMacDesktopPage.FROM_NAME_START_TO_FIRST_OBJECT_OFFSET_Y
        )

    def click_import_button(self):
        self.get_element_by_xpath(ImportDataPopupMacDesktopPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_mac_desktop_page.wait_for_import_to_finish_successfully()

    def click_prepare_data_button(self):
        self.get_element_by_xpath(ImportDataPopupMacDesktopPage.PREPARE_BUTTON_ELEM).click()
