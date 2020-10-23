from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException


class RightPanelTileWindowsDesktopPage(BaseWindowsDesktopPage):
    DUPLICATE_BUTTON_ELEM = 'Duplicate button'
    EDIT_BUTTON_ELEM = 'Edit button'
    REFRESH_BUTTON_ELEM = 'Refresh button'
    REMOVE_BUTTON_ELEM = 'Remove button'
    NOTIFICATION_ICON = 'successful_fill'

    BUTTON_OK = 'OK'
    REFRESHING_TEXT_ELEM = 'Refreshing'
    IMPORTING_TEXT_ELEM = 'Importing'
    REMOVING_TEXT_ELEM = 'Removing'

    PROGRESS_BAR_TAG_NAME = 'ProgressBar'

    POPUP_WINDOW_ELEM = 'NUIDialog'
    RIGHT_PANEL_ELEM = 'MicroStrategy for Office'
    OBJECT_NAME_ELEM = '//DataItem[%s]/Group/Button/Text'

    TILES_WRAPPER = '//Group[starts-with(@Name,"Imported Data")]/List'
    TILE_ELEM = '//DataItem'

    NAME_INPUT_FOR_OBJECT = '//Button/Text'
    TEXT_INPUT_TAG_NAME = 'Edit'
    TOOLTIP_TEXT = '//ToolTip/Text'

    RENAME_MENU_ITEM = 'Rename'
    REMOVE_MENU_ITEM = 'Remove'

    def wait_for_import_object_to_finish_successfully(self):
        while self.check_if_element_exists_by_name(RightPanelTileWindowsDesktopPage.IMPORTING_TEXT_ELEM,
                                                   timeout=SHORT_TIMEOUT):
            pass

    def wait_for_refresh_object_to_finish_successfully(self):
        while self.check_if_element_exists_by_name(RightPanelTileWindowsDesktopPage.REFRESHING_TEXT_ELEM,
                                                   timeout=SHORT_TIMEOUT):
            pass

    def wait_for_remove_object_to_finish_successfully(self):
        while self.check_if_element_exists_by_name(RightPanelTileWindowsDesktopPage.REMOVING_TEXT_ELEM,
                                                   timeout=SHORT_TIMEOUT):
            pass

    def wait_using_parent_for_remove_object_to_finish_successfully(self, parent):
        while parent.check_if_element_exists_by_name(RightPanelTileWindowsDesktopPage.REMOVING_TEXT_ELEM,
                                                     timeout=SHORT_TIMEOUT):
            pass

    def wait_for_progress_notifications_to_disappear(self):
        right_panel_element = self.get_element_by_name(RightPanelTileWindowsDesktopPage.RIGHT_PANEL_ELEM)

        while right_panel_element.check_if_element_exists_by_tag_name(
                RightPanelTileWindowsDesktopPage.PROGRESS_BAR_TAG_NAME, timeout=SHORT_TIMEOUT):
            pass

    def close_all_notifications_on_hover(self):
        elements = self.get_elements_by_name(RightPanelTileWindowsDesktopPage.DUPLICATE_BUTTON_ELEM)

        for element in elements:
            element.move_to()

    def close_all_warning_notifications(self):
        elements = self.get_elements_by_name(RightPanelTileWindowsDesktopPage.BUTTON_OK)

        for element in elements:
            element.click()

    def close_last_notification_on_hover(self):
        import_ended = self.get_element_by_accessibility_id(RightPanelTileWindowsDesktopPage.NOTIFICATION_ICON)

        if not import_ended:
            raise MstrException(f'Notification could not be closed, '
                                f'selector not found: {RightPanelTileWindowsDesktopPage.NOTIFICATION_ICON}')
        
        self._hover_over_tile(0)

    def close_object_notification_on_hover(self, object_no):
        self._hover_over_tile(int(object_no) - 1)

    def click_duplicate(self, tile_no):
        WindowsDesktopMainAddInElementCache.invalidate_cache()

        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.DUPLICATE_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def click_refresh(self, tile_no):
        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.REFRESH_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def click_edit(self, tile_no):
        WindowsDesktopMainAddInElementCache.invalidate_cache()

        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.EDIT_BUTTON_ELEM, tile_no)

        plugin_window = self.check_if_element_exists_by_class_name(RightPanelTileWindowsDesktopPage.POPUP_WINDOW_ELEM)

        if not plugin_window:
            raise MstrException('MicroStrategy for office is not visible')

    def remove_object_using_icon(self, tile_no):
        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.REMOVE_BUTTON_ELEM, tile_no)

        self.wait_for_remove_object_to_finish_successfully()

    def _click_button_on_tile(self, button_selector, tile_no):
        """
        Clicks button given by selector on tile number object_no.
        :param button_selector: Button selector.
        :param tile_no: Number of tile, counting from 1.
        """
        elements = self.get_elements_by_name(button_selector)

        object_index = int(tile_no) - 1

        if object_index > len(elements):
            raise MstrException(('Not possible to click tile, given object index is too big', object_index, elements))

        found_element = elements[object_index]

        # Workaround - hover over the tile and move mouse a little to gain focus
        self._hover_over_tile(object_index)

        found_element.move_to(20, 20)
        found_element.move_to(-20, -20)

        found_element.click()

    def _hover_over_tile(self, tile_no):
        self._get_object_by_index(
            tile_no
        ).move_to()

    def get_object_name(self, index):
        right_panel_element = self.get_element_by_name(RightPanelTileWindowsDesktopPage.RIGHT_PANEL_ELEM)

        object_name_element = right_panel_element.get_element_by_xpath(
            RightPanelTileWindowsDesktopPage.OBJECT_NAME_ELEM % index
        )

        return object_name_element.get_name_by_attribute()

    def click_object_number(self, object_no):
        self._get_object_by_index(object_no).click()

    def change_object_name_using_icon(self, object_no, new_object_name):
        object_tile_elem = self._get_object_by_index(object_no)

        name_container = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT)
        name_container.move_to()
        name_container.double_click()

        name_text = object_tile_elem.get_element_by_tag_name(RightPanelTileWindowsDesktopPage.TEXT_INPUT_TAG_NAME)
        name_text.send_keys(new_object_name)

        self.press_enter()

    def change_object_name_using_context_menu(self, object_no, new_object_name):
        object_tile_elem = self._get_object_by_index(object_no)

        name_container = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT)
        name_container.move_to()
        name_container.right_click()

        object_tile_elem.get_element_by_name(
            RightPanelTileWindowsDesktopPage.RENAME_MENU_ITEM
        ).click()

        name_text = object_tile_elem.get_element_by_tag_name(RightPanelTileWindowsDesktopPage.TEXT_INPUT_TAG_NAME)
        name_text.send_keys(new_object_name)

        self.press_enter()

    def remove_object_using_context_menu(self, object_no):
        object_tile_elem = self._get_object_by_index(object_no)

        name_container = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT)
        name_container.move_to()
        name_container.right_click()

        object_tile_elem.get_element_by_name(
            RightPanelTileWindowsDesktopPage.REMOVE_MENU_ITEM
        ).click()

        self.wait_using_parent_for_remove_object_to_finish_successfully(object_tile_elem)

    def get_object_name_from_tooltip(self, object_no):
        object_tile_elem = self._get_object_by_index(object_no)

        name_container = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT)
        name_container.move_to()

        tooltip_text_elem = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.TOOLTIP_TEXT)

        return tooltip_text_elem.text

    def _get_object_by_index(self, object_no):
        tiles_wrapper = self.get_element_by_xpath(RightPanelTileWindowsDesktopPage.TILES_WRAPPER)

        tiles = tiles_wrapper.get_elements_by_xpath(RightPanelTileWindowsDesktopPage.TILE_ELEM)

        object_index = int(object_no) - 1

        return tiles[object_index]

    def is_icon_bar_visible(self, object_no):
        # TODO: There is no way for now to recognize if bar is visible, is_display() on icon bar and its elements
        # is always returns true. This method should be updated when there will be added an element attribute making
        # it possible to distinguish if icon bar is visible.
        return True
