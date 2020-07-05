from pages.base_browser_page import BaseBrowserPage


class RightPanelBrowserPage(BaseBrowserPage):
    IMPORT_DATA_BUTTON_ELEM = '#overlay > div.side-panel > div.import-data > button'
    ADD_DATA_BUTTON_ELEM = 'add-data-btn'

    NOTIFICATION_TEXT_ELEM = '.notification-text'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'

    IMPORT_SUCCESSFUL_TEXT = 'Import successful'
    DUPLICATE_OBJECT_SUCCESSFUL_TEXT = 'Object duplicated'
    REFRESH_OBJECT_SUCCESSFUL_TEXT = 'Refresh complete'
    REMOVE_OBJECT_SUCCESSFUL_TEXT = 'Object removed'

    OBJECT_CONTAINER = '.object-tile-content'
    OBJECT_CONTAINER_NTH = '.object-tile-content:nth-child(%s)'
    NOTIFICATION_CONTAINER = '.notification-container'

    SIDE_PANEL_HEADER = '.side-panel > .header'

    RIGHT_PANEL_TILE = '#overlay > div.side-panel > div.object-tile-container > ' \
                       'div.object-tile-list > article:nth-child(%s) > div > div'

    RIGHT_PANEL_TILE_BUTTON_PREFIX = RIGHT_PANEL_TILE + ' > div.object-tile-header > span.icon-bar-container > ' \
                                                        'span > '

    DUPLICATE_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(1)'
    REFRESH_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(5)'
    EDIT_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(3)'
    REMOVE_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(6)'
    NOTIFICATION_BUTTON = '.warning-notification-button-container'

    NAME_INPUT_FOR_OBJECT = RIGHT_PANEL_TILE + ' > div.object-tile-name-row > div.rename-input'
    NAME_INPUT_TEXT_FOR_OBJECT = RIGHT_PANEL_TILE + ' > div.object-tile-name-row > input'

    DOTS_MENU = '#overlay > div > div.header > div.settings > button > span > svg'
    DOTS_MENU_ITEM_LOG_OUT = 'logOut'

    ADD_IN_OVERLAY_ELEM = 'overlay'
    CSS_OPACITY_ATTRIBUTE = 'opacity'
    DIALOG_OPEN_NOTIFICATION = '''//span[text()='A MicroStrategy for Office Add-in dialog is open']'''

    TILE_CONTEXT_MENU_ITEMS = '.react-contextmenu-item'
    TILE_CONTEXT_MENU_OPTION_RENAME = 'Rename'
    TILE_CONTEXT_MENU_OPTION_REMOVE = 'Remove'

    def click_import_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelBrowserPage.IMPORT_DATA_BUTTON_ELEM).click()

    def click_add_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RightPanelBrowserPage.ADD_DATA_BUTTON_ELEM).click()

    def wait_for_import_to_finish_successfully(self):
        self._wait_for_operation_successfully_completed(RightPanelBrowserPage.IMPORT_SUCCESSFUL_TEXT)

    def wait_for_duplicate_object_to_finish_successfully(self):
        self._wait_for_operation_successfully_completed(RightPanelBrowserPage.DUPLICATE_OBJECT_SUCCESSFUL_TEXT)

    def wait_for_refresh_object_to_finish_successfully(self):
        self._wait_for_operation_successfully_completed(RightPanelBrowserPage.REFRESH_OBJECT_SUCCESSFUL_TEXT)

    def wait_for_remove_object_to_finish_successfully(self):
        self._wait_for_operation_successfully_completed(RightPanelBrowserPage.REMOVE_OBJECT_SUCCESSFUL_TEXT)

    def _wait_for_operation_successfully_completed(self, expected_message):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(RightPanelBrowserPage.NOTIFICATION_TEXT_ELEM,
                                                             RightPanelBrowserPage.TEXT_CONTENT_ATTRIBUTE,
                                                             expected_message)

    def wait_for_operation_error(self, expected_message):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(RightPanelBrowserPage.NOTIFICATION_TEXT_ELEM,
                                                             RightPanelBrowserPage.TEXT_CONTENT_ATTRIBUTE,
                                                             expected_message)
                                                              
        self.get_element_by_css(RightPanelBrowserPage.NOTIFICATION_BUTTON).click()

    def close_all_notifications_on_hover(self):
        self.focus_on_add_in_frame()

        tiles = self.get_elements_by_css(RightPanelBrowserPage.OBJECT_CONTAINER)
        other_container = self.get_element_by_css(RightPanelBrowserPage.SIDE_PANEL_HEADER)

        for tile in tiles:
            other_container.move_to()
            tile.move_to()

    def close_last_notification_on_hover(self):
        self.focus_on_add_in_frame()

        self._hover_over_tile(0)

    def click_duplicate(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

        self.get_element_by_css(RightPanelBrowserPage.DUPLICATE_BUTTON_FOR_OBJECT % object_no).click()

    def click_refresh(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

        self.get_element_by_css(RightPanelBrowserPage.REFRESH_BUTTON_FOR_OBJECT % object_no).click()

        self.wait_for_refresh_object_to_finish_successfully()

    def _hover_over_tile(self, tile_no):
        other_container = self.get_element_by_css(RightPanelBrowserPage.SIDE_PANEL_HEADER)
        other_container.move_to()

        tiles = self.get_elements_by_css(RightPanelBrowserPage.OBJECT_CONTAINER)
        tiles[tile_no].move_to()

    def click_edit(self, object_no):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelBrowserPage.EDIT_BUTTON_FOR_OBJECT % object_no).click()

    def get_object_name(self, index):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelBrowserPage.NAME_INPUT_FOR_OBJECT % index)

        return name_input.text

    def change_object_name_using_icon(self, object_number, new_object_name):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelBrowserPage.NAME_INPUT_FOR_OBJECT % object_number)
        name_input.double_click()

        name_text = self.get_element_by_css(RightPanelBrowserPage.NAME_INPUT_TEXT_FOR_OBJECT % object_number)
        name_text.send_keys_raw(new_object_name)

        self.press_enter()

    def change_object_name_using_context_menu(self, object_number, new_object_name):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.find_element_in_list_by_text(
            RightPanelBrowserPage.TILE_CONTEXT_MENU_ITEMS,
            RightPanelBrowserPage.TILE_CONTEXT_MENU_OPTION_RENAME
        ).move_to_and_click()

        name_text = self.get_element_by_css(RightPanelBrowserPage.NAME_INPUT_TEXT_FOR_OBJECT % object_number)
        name_text.send_keys_raw(new_object_name)

        self.press_enter()

    def remove_object_using_icon(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

        self.get_element_by_css(RightPanelBrowserPage.REMOVE_BUTTON_FOR_OBJECT % object_no).click()

        self.wait_for_remove_object_to_finish_successfully()

    def remove_object_using_context_menu(self, object_number):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.find_element_in_list_by_text(
            RightPanelBrowserPage.TILE_CONTEXT_MENU_ITEMS,
            RightPanelBrowserPage.TILE_CONTEXT_MENU_OPTION_REMOVE
        ).move_to_and_click()

        self.wait_for_remove_object_to_finish_successfully()

    def logout(self):
        self.focus_on_add_in_frame()

        if self.check_if_element_exists_by_css(RightPanelBrowserPage.DOTS_MENU, timeout=5):
            self.get_element_by_css(RightPanelBrowserPage.DOTS_MENU).click()

            self.get_element_by_id(RightPanelBrowserPage.DOTS_MENU_ITEM_LOG_OUT).click()
