from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.exception.MstrException import MstrException
from framework.util.message_const import MessageConst
from pages.excel.excel_menu.excel_menu_mac_desktop_page import ExcelMenuMacDesktopPage


class RightPanelTileMacDesktopPage(BaseMacDesktopPage):
    TILES = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']/AXGroup[%s]"

    NOTIFICATION_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList/AXGroup[0]/AXGroup[0]" \
                                                                   "/AXGroup[0]/AXStaticText[@AXValue='%s']"

    TILE_OBJECT_LIST = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + "/AXList[@AXSubrole='AXContentList']"

    ERROR_NOTIFICATION_ELEM = TILE_OBJECT_LIST + "/AXGroup[0]/AXGroup[0]/AXGroup[1]/AXStaticText[@AXValue='%s']"
    ERROR_NOTIFICATION_OK_ELEM = TILE_OBJECT_LIST + "/AXGroup[0]/AXGroup[0]/AXGroup[3]/AXButton[@AXTitle='OK']"

    DUPLICATE_BUTTON_ELEMS = TILE_OBJECT_LIST + "/AXGroup[%s]/AXButton[0]"
    EDIT_BUTTON_ELEMS = TILE_OBJECT_LIST + "/AXGroup[%s]/AXButton[1]"
    REFRESH_BUTTON_ELEMS = TILE_OBJECT_LIST + "/AXGroup[%s]/AXButton[2]"
    REMOVE_BUTTON_ELEMS = TILE_OBJECT_LIST + "/AXGroup[%s]/AXButton[3]"
    TITLE_BUTTON_ELEMS = TILE_OBJECT_LIST + "/AXGroup[%s]/AXButton[4]"

    TITLE_ATTRIBUTE = 'AXTitle'

    def wait_for_refresh_object_to_finish_successfully(self):
        self.check_if_element_exists_by_xpath(
            RightPanelTileMacDesktopPage.NOTIFICATION_ELEM % MessageConst.REFRESH_OBJECT_SUCCESSFUL_TEXT
        )

    def wait_for_remove_object_to_finish_successfully(self):
        self.check_if_element_exists_by_xpath(
            RightPanelTileMacDesktopPage.NOTIFICATION_ELEM % MessageConst.REMOVE_OBJECT_SUCCESSFUL_TEXT
        )

    def wait_for_import_to_finish_successfully(self):
        self.check_if_element_exists_by_xpath(
            RightPanelTileMacDesktopPage.NOTIFICATION_ELEM % MessageConst.IMPORT_SUCCESSFUL_TEXT
        )

    def wait_for_duplicate_object_to_finish_successfully(self):
        self.check_if_element_exists_by_xpath(
            RightPanelTileMacDesktopPage.NOTIFICATION_ELEM % MessageConst.DUPLICATE_OBJECT_SUCCESSFUL_TEXT
        )

    def close_all_notifications_on_hover(self):
        tiles = self.get_elements_by_xpath(RightPanelTileMacDesktopPage.TILES)
        other_container = self.get_element_by_xpath(ExcelMenuMacDesktopPage.VIEW_TAB_ELEM)

        for tile in tiles:
            other_container.move_to()
            tile.move_to()

    def close_last_notification_on_hover(self):
        self._hover_over_tile(0)

    def _get_title_buttons_for_all_tiles(self):
        return self.get_elements_by_xpath(RightPanelTileMacDesktopPage.TITLE_BUTTON_ELEMS)

    def _hover_over_tile(self, tile_no):
        other_container = self.get_element_by_xpath(ExcelMenuMacDesktopPage.VIEW_TAB_ELEM)
        other_container.move_to()

        tiles = self.get_elements_by_xpath(RightPanelTileMacDesktopPage.TILES)
        if tiles:
            tiles[tile_no].move_to()

    def click_duplicate(self, object_no):
        self._click_tile_button(object_no, RightPanelTileMacDesktopPage.DUPLICATE_BUTTON_ELEMS)

    def click_refresh(self, object_no):
        self._click_tile_button(object_no, RightPanelTileMacDesktopPage.REFRESH_BUTTON_ELEMS)

    def click_edit(self, object_no):
        self._click_tile_button(object_no, RightPanelTileMacDesktopPage.EDIT_BUTTON_ELEMS)

    def remove_object_using_icon(self, object_no):
        self._click_tile_button(object_no, RightPanelTileMacDesktopPage.REMOVE_BUTTON_ELEMS)

        self.wait_for_remove_object_to_finish_successfully()

    def _click_tile_button(self, object_no, selector):
        object_index = int(object_no) - 1

        self._hover_over_tile(object_index)

        buttons = self.get_elements_by_xpath(selector)
        buttons[object_index].click()

    def get_object_name(self, object_no):
        object_index = int(object_no) - 1

        title_button_element = self._get_title_buttons_for_all_tiles()[object_index]

        return title_button_element.get_attribute(RightPanelTileMacDesktopPage.TITLE_ATTRIBUTE)

    def check_if_error_message_is_correct(self, error_message):
        error_message_selector = RightPanelTileMacDesktopPage.ERROR_NOTIFICATION_ELEM % error_message

        if not self.check_if_element_exists_by_xpath(error_message_selector):
            raise MstrException(f'Different notification displayed, expected: {error_message}')

    def close_error_notification(self):
        self.get_element_by_xpath(RightPanelTileMacDesktopPage.ERROR_NOTIFICATION_OK_ELEM).click()
