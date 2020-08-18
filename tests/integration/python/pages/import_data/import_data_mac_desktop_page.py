from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.util import Util
from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage


class ImportDataMacDesktopPage(BaseMacDesktopPage):
    MY_LIBRARY_SWITCH_ELEM = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[0]/AXGroup[0]/" \
                                                                     "AXCheckBox[@AXSubrole='AXSwitch']"

    MY_LIBRARY_SWITCH_VALUE_ATTR = 'AXValue'
    MY_LIBRARY_SWITCH_VALUE_ATTR_ON_VALUE = '1'

    SEARCH_BAR_ELEM_GROUPS = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[0]/AXGroup[%s]"
    SEARCH_BAR_ELEM = SEARCH_BAR_ELEM_GROUPS + "/AXTextField[0]"

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
        element = self.get_element_by_xpath(ImportDataMacDesktopPage.MY_LIBRARY_SWITCH_ELEM)

        if self._is_on(element):
            element.click()

    def _is_on(self, element):
        value = element.get_attribute(ImportDataMacDesktopPage.MY_LIBRARY_SWITCH_VALUE_ATTR)
        return value == ImportDataMacDesktopPage.MY_LIBRARY_SWITCH_VALUE_ATTR_ON_VALUE

    def find_and_select_object(self, object_name):
        search_box_groups_no = self.get_elements_by_xpath(ImportDataMacDesktopPage.SEARCH_BAR_ELEM_GROUPS)

        search_box = self.get_element_by_xpath_workaround(
            ImportDataMacDesktopPage.SEARCH_BAR_ELEM,
            len(search_box_groups_no)
        )
        search_box.send_keys_with_check(object_name)

        Util.pause(2)  # TODO wait when ready

        self.get_element_by_xpath(
            ImportDataMacDesktopPage.NAME_HEADER_ELEM
        ).click(
            offset_x=ImportDataMacDesktopPage.FROM_NAME_START_TO_FIRST_OBJECT_OFFSET_X,
            offset_y=ImportDataMacDesktopPage.FROM_NAME_START_TO_FIRST_OBJECT_OFFSET_Y
        )

    def click_import_button(self):
        self.get_element_by_xpath(ImportDataMacDesktopPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_mac_desktop_page.wait_for_import_to_finish_successfully()

    def click_prepare_data_button(self):
        self.get_element_by_xpath(ImportDataMacDesktopPage.PREPARE_BUTTON_ELEM).click()
