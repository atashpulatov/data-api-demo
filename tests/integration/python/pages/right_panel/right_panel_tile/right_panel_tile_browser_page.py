from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import DEFAULT_TIMEOUT
from framework.util.message_const import MessageConst


class RightPanelTileBrowserPage(BaseBrowserPage):
    NOTIFICATION_TEXT_ELEM = '.notification-text'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'
    PROGRESS_BAR = '.progress-bar'

    TILES = '.object-tile-content'

    SIDE_PANEL_HEADER = '.side-panel > .header'

    RIGHT_PANEL_TILE = '.object-tile-list > article:nth-child(%s) > div > .react-contextmenu-wrapper'

    RIGHT_PANEL_TILE_BUTTON_PREFIX = RIGHT_PANEL_TILE + ' .icon-bar '

    DUPLICATE_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-of-type(1)'
    EDIT_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-of-type(2)'
    REFRESH_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-of-type(3)'
    REMOVE_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-of-type(4)'
    NOTIFICATION_BUTTON = '.warning-notification-button-container'

    NAME_INPUT_FOR_OBJECT = RIGHT_PANEL_TILE + ' .rename-input.view-only'
    NAME_INPUT_TEXT_FOR_OBJECT = RIGHT_PANEL_TILE + ' .rename-input.editable'

    RIGHT_PANEL_TILE_TOOLTIP = RIGHT_PANEL_TILE + ' .object-tile-name-row .__react_component_tooltip'

    TILE_CONTEXT_MENU_ITEMS = '.react-contextmenu-item'
    TILE_CONTEXT_MENU_OPTION_RENAME = 'Rename'
    TILE_CONTEXT_MENU_OPTION_REMOVE = 'Remove'
    TILE_CONTEXT_MENU_WRAPPER = '.react-contextmenu-wrapper'

    OBJECT_TILE_ACTIONS = '.icon-bar'

    def wait_for_import_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.IMPORT_SUCCESSFUL_TEXT, timeout)

    def wait_for_duplicate_object_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.DUPLICATE_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_refresh_object_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.REFRESH_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_import_object_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.IMPORT_SUCCESSFUL_TEXT, timeout)

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

    def wait_for_progress_notifications_to_disappear(self, timeout=DEFAULT_TIMEOUT):
        self.focus_on_add_in_frame()

        self.wait_for_elements_to_disappear_from_dom(RightPanelTileBrowserPage.PROGRESS_BAR, timeout=timeout)

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

    def close_object_notification_on_hover(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

    def close_all_warning_notifications(self):
        self.focus_on_add_in_frame()

        warnings_notifications_ok_buttons = self.get_elements_by_css(
            RightPanelTileBrowserPage.NOTIFICATION_BUTTON
        )

        for button in warnings_notifications_ok_buttons:
            button.click()

    def click_duplicate(self, tile_no):
        self._click_tile_button(RightPanelTileBrowserPage.DUPLICATE_BUTTON_FOR_OBJECT, tile_no)

    def click_refresh(self, tile_no):
        self._click_tile_button(RightPanelTileBrowserPage.REFRESH_BUTTON_FOR_OBJECT, tile_no)

    def click_edit(self, tile_no):
        self._click_tile_button(RightPanelTileBrowserPage.EDIT_BUTTON_FOR_OBJECT, tile_no)

    def remove_object_using_icon(self, tile_no):
        self._click_tile_button(RightPanelTileBrowserPage.REMOVE_BUTTON_FOR_OBJECT, tile_no)

        self.wait_for_remove_object_to_finish_successfully()

    def _click_tile_button(self, selector, tile_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(tile_no) - 1)

        self.get_element_by_css(selector % tile_no).click()

    def _hover_over_tile(self, tile_no):
        other_container = self.get_element_by_css(RightPanelTileBrowserPage.SIDE_PANEL_HEADER)
        other_container.move_to()

        tiles = self.get_elements_by_css(RightPanelTileBrowserPage.TILES)
        tiles[tile_no].move_to()

    def click_object_number(self, object_no):
        self.focus_on_add_in_frame()

        object_index = int(object_no) - 1

        tile_context_menu_wrappers = self.get_elements_by_css(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_WRAPPER
        )

        tile_context_menu_wrappers[object_index].click()

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

    def remove_object_using_context_menu(self, object_number):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.find_element_in_list_by_text(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_ITEMS,
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_REMOVE
        ).move_to_and_click()

        self.wait_for_remove_object_to_finish_successfully()

    def get_object_name_from_tooltip(self, object_number):
        self.focus_on_add_in_frame()

        name_container = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % object_number)
        name_container.move_to()

        object_name = self._get_name_tooltip_text(object_number)

        return object_name

    def _get_name_tooltip_text(self, object_number):
        name_tooltip = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE_TOOLTIP % object_number)

        return name_tooltip.text

    def is_icon_bar_visible(self, object_number):
        self.focus_on_add_in_frame()

        object_index = int(object_number) - 1

        tile_context_menu_wrappers = self.get_elements_by_css(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_WRAPPER
        )

        icon_bar = tile_context_menu_wrappers[object_index].get_element_by_css(
            RightPanelTileBrowserPage.OBJECT_TILE_ACTIONS
        )

        opacity_value = icon_bar.get_opacity()

        return int(opacity_value) > 0