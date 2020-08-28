from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.message_const import MessageConst
from framework.util.const import DEFAULT_TIMEOUT

class RightPanelTileBrowserPage(BaseBrowserPage):
    NOTIFICATION_TEXT_ELEM = '.notification-text'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'

    TILES = '.object-tile-content'

    SIDE_PANEL_HEADER = '.side-panel > .header'

    RIGHT_PANEL_TILE = '#overlay > div > div.object-tile-container > ' \
                       'div.object-tile-list > article:nth-child(%s) > div > div.react-contextmenu-wrapper'

    RIGHT_PANEL_TILE_BUTTON_PREFIX = RIGHT_PANEL_TILE + ' > div > div.object-tile-header > span.icon-bar-container > ' \
                                                        'span > '

    DUPLICATE_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(1)'
    REFRESH_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(5)'
    EDIT_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(3)'
    REMOVE_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(6)'
    BUTTON_FOR_OBJECT_AT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(%s)'
    NOTIFICATION_BUTTON = '.warning-notification-button-container'

    NAME_INPUT_FOR_OBJECT = RIGHT_PANEL_TILE + ' div.object-tile-name-row > div.rename-input'
    NAME_INPUT_TEXT_FOR_OBJECT = RIGHT_PANEL_TILE + ' div.object-tile-name-row > input'

    RIGHT_PANEL_TILE_TOOLTIP = RIGHT_PANEL_TILE + ' > div > div.object-tile-name-row div.__react_component_tooltip'

    TILE_CONTEXT_MENU_ITEMS = '.react-contextmenu-item'
    TILE_CONTEXT_MENU_OPTION_RENAME = 'Rename'
    TILE_CONTEXT_MENU_OPTION_REMOVE = 'Remove'

    def wait_for_import_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.IMPORT_SUCCESSFUL_TEXT, timeout)

    def wait_for_duplicate_object_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.DUPLICATE_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_refresh_object_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.REFRESH_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_remove_object_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.REMOVE_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_operation_error_and_accept(self, expected_message, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(expected_message, timeout)

        self.get_element_by_css(RightPanelTileBrowserPage.NOTIFICATION_BUTTON).click()

    def _wait_for_operation_with_status(self, expected_message, timeout):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(RightPanelTileBrowserPage.NOTIFICATION_TEXT_ELEM,
                                                             RightPanelTileBrowserPage.TEXT_CONTENT_ATTRIBUTE,
                                                             expected_message,
                                                             timeout=timeout)

    def close_all_notifications_on_hover(self):
        self.focus_on_add_in_frame()

        tiles = self.get_elements_by_css(RightPanelTileBrowserPage.TILES)
        other_container = self.get_element_by_css(RightPanelTileBrowserPage.SIDE_PANEL_HEADER)

        for tile in tiles:
            other_container.move_to()
            tile.move_to()

    def close_last_notification_on_hover(self):
        self.focus_on_add_in_frame()

        self._hover_over_tile(0)

    def close_all_warning_notifications(self):
        self.focus_on_add_in_frame()

        warnings_notifications_ok_buttons = self.get_elements_by_css(
          RightPanelTileBrowserPage.NOTIFICATION_BUTTON
        )

        for button in warnings_notifications_ok_buttons:
            button.click()

    def click_duplicate(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

        self.get_element_by_css(RightPanelTileBrowserPage.DUPLICATE_BUTTON_FOR_OBJECT % object_no).click()

    def click_refresh(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

        self.get_element_by_css(RightPanelTileBrowserPage.REFRESH_BUTTON_FOR_OBJECT % object_no).click()

    def _hover_over_tile(self, tile_no):
        other_container = self.get_element_by_css(RightPanelTileBrowserPage.SIDE_PANEL_HEADER)
        other_container.move_to()

        tiles = self.get_elements_by_css(RightPanelTileBrowserPage.TILES)
        tiles[tile_no].move_to()

    def click_edit(self, object_no):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelTileBrowserPage.EDIT_BUTTON_FOR_OBJECT % object_no).click()

    def click_highlight(self, object_no):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_no).click()

    def get_object_name(self, index):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % index)

        return name_input.text

    def change_object_name_using_icon(self, object_number, new_object_name):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % object_number)
        name_input.double_click()

        name_text = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_TEXT_FOR_OBJECT % object_number)
        name_text.send_keys(new_object_name)

        self.press_enter()

    def change_object_name_using_context_menu(self, object_number, new_object_name):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.find_element_in_list_by_text(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_ITEMS,
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_RENAME
        ).move_to_and_click()

        name_text = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_TEXT_FOR_OBJECT % object_number)
        name_text.send_keys(new_object_name)

        self.press_enter()

    def remove_object_using_icon(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

        self.get_element_by_css(RightPanelTileBrowserPage.REMOVE_BUTTON_FOR_OBJECT % object_no).click()

        self.wait_for_remove_object_to_finish_successfully()

    def remove_object_using_context_menu(self, object_number):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.find_element_in_list_by_text(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_ITEMS,
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_REMOVE
        ).move_to_and_click()

        self.wait_for_remove_object_to_finish_successfully()

    def _get_name_tooltip_text(self,object_number):
      name_tooltip = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE_TOOLTIP % object_number) 
      return name_tooltip.text

    def get_object_name_from_tooltip(self, object_number):
      self.focus_on_add_in_frame()

      other_container = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % object_number)
      other_container.move_to()

      object_name = self._get_name_tooltip_text(object_number)

      return object_name