from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.message_const import MessageConst
from pages.excel.excel_menu.excel_menu_mac_desktop_page import ExcelMenuMacDesktopPage


class RightPanelTileMacDesktopPage(BaseMacDesktopPage):
    TILES = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']/AXGroup[%s]"

    NOTIFICATION_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList/AXGroup[0]/AXGroup[0]/" \
                                                                   "AXGroup[0]/AXStaticText[@AXValue='%s']"

    ERROR_NOTIFICATION_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']/AXGroup[0]" \
                                                                         "/AXGroup[0]/AXGroup[1]/AXStaticText[@AXValue='%s']"

    ERROR_NOTIFICATION_OK_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']/AXGroup[0]" \
                                                                            "/AXGroup[0]/AXGroup[3]/AXButton[@AXTitle='OK']"

    DUPLICATE_BUTTON_ELEMS = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']/" \
                                                                        "AXGroup[%s]/AXButton[0]"

    EDIT_BUTTON_ELEMS = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']/" \
                                                                   "AXGroup[%s]/AXButton[1]"

    TITLE_BUTTON_ELEMS = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']/" \
                                                                    "AXGroup[%s]/AXButton[4]"

    TITLE_ATTRIBUTE = 'AXTitle'

    def wait_for_import_to_finish_successfully(self):
        self.check_if_element_exists_by_xpath(
            RightPanelTileMacDesktopPage.NOTIFICATION_ELEM % MessageConst.IMPORT_SUCCESSFUL_TEXT)

    def wait_for_duplicate_object_to_finish_successfully(self):
        self.check_if_element_exists_by_xpath(
            RightPanelTileMacDesktopPage.NOTIFICATION_ELEM % MessageConst.DUPLICATE_OBJECT_SUCCESSFUL_TEXT)

    def close_all_notifications_on_hover(self):
        tiles = self.get_elements_by_xpath(RightPanelTileMacDesktopPage.TILES)
        other_container = self.get_element_by_xpath(ExcelMenuMacDesktopPage.TABLE_TAB_ELEM)

        for tile in tiles:
            other_container.move_to()
            tile.move_to()

    def close_last_notification_on_hover(self):
        self._hover_over_tile(0)

    def click_duplicate(self, object_no):
        object_index = int(object_no) - 1

        self._hover_over_tile(object_index)

        self._get_duplicate_buttons_for_all_tiles()[object_index].click()

    def _get_duplicate_buttons_for_all_tiles(self):
        return self.get_elements_by_xpath(RightPanelTileMacDesktopPage.DUPLICATE_BUTTON_ELEMS)

    def _get_edit_buttons_for_all_tiles(self):
        return self.get_elements_by_xpath(RightPanelTileMacDesktopPage.EDIT_BUTTON_ELEMS)

    def _get_title_buttons_for_all_tiles(self):
        return self.get_elements_by_xpath(RightPanelTileMacDesktopPage.TITLE_BUTTON_ELEMS)

    def _hover_over_tile(self, tile_no):
        other_container = self.get_element_by_xpath(ExcelMenuMacDesktopPage.TABLE_TAB_ELEM)
        other_container.move_to()

        tiles = self.get_elements_by_xpath(RightPanelTileMacDesktopPage.TILES)
        tiles[tile_no].move_to()

    def click_edit(self, object_no):
        object_index = int(object_no) - 1
        self._hover_over_tile(object_index)

        self._get_edit_buttons_for_all_tiles()[object_index].click()

    def get_object_name(self, object_no):
        object_index = int(object_no) - 1

        title_button_element = self._get_title_buttons_for_all_tiles()[object_index]

        return title_button_element.get_attribute(RightPanelTileMacDesktopPage.TITLE_ATTRIBUTE)
