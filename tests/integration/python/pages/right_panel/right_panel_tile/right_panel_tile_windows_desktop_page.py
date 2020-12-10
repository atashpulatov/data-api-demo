import time

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.util.const import SHORT_TIMEOUT, LONG_TIMEOUT
from framework.util.exception.MstrException import MstrException


class RightPanelTileWindowsDesktopPage(BaseWindowsDesktopPage):
    DUPLICATE_BUTTON_ELEM = 'Duplicate button'
    EDIT_BUTTON_ELEM = 'Edit button'
    REFRESH_BUTTON_ELEM = 'Refresh button'
    REMOVE_BUTTON_ELEM = 'Remove button'

    BUTTON_OK = 'OK'
    DUPLICATING_TEXT_ELEM = 'Duplicating'
    REFRESHING_TEXT_ELEM = 'Refreshing'
    IMPORTING_TEXT_ELEM = 'Importing'
    REMOVING_TEXT_ELEM = 'Removing'

    NOTIFICATIONS_TEXTS = [
      'Import successful',
      'Refresh complete',
      'Object removed',
      'Object duplicated'
      ]

    PROGRESS_BAR_TAG_NAME = 'ProgressBar'

    POPUP_WINDOW_ELEM = 'NUIDialog'
    RIGHT_PANEL_ELEM = 'MicroStrategy for Office'
    OBJECT_NAME_ELEM = '//DataItem[%s]/Group/Button/Text'

    TILE_LIST = '//Group/List'
    TILE_ELEM = '//Group/List/DataItem[%s]'

    NAME_INPUT_FOR_OBJECT = '//Button/Text'
    NAME_INPUT_FOR_OBJECT_AFTER_DOUBLE_CLICK = '//Edit'
    TEXT_INPUT_TAG_NAME = 'Edit'
    TOOLTIP_TEXT = '//ToolTip/Text'

    RENAME_MENU_ITEM = 'Rename'
    REMOVE_MENU_ITEM = 'Remove'

    XML_FIRST_ELEMENT_INDEX = '1'

    def wait_for_import_object_to_finish_successfully(self):
        self._wait_until_element_disappears(
            self.check_if_element_exists_by_name,
            RightPanelTileWindowsDesktopPage.IMPORTING_TEXT_ELEM
        )

    def wait_for_duplicate_object_to_finish_successfully(self):
        self._wait_until_element_disappears(
            self.check_if_element_exists_by_name,
            RightPanelTileWindowsDesktopPage.DUPLICATING_TEXT_ELEM
        )

    def wait_for_refresh_object_to_finish_successfully(self):
        self._wait_until_element_disappears(
            self.check_if_element_exists_by_name,
            RightPanelTileWindowsDesktopPage.REFRESHING_TEXT_ELEM
        )

    def wait_for_remove_object_to_finish_successfully(self):
        self._wait_until_element_disappears(
            self.check_if_element_exists_by_name,
            RightPanelTileWindowsDesktopPage.REMOVING_TEXT_ELEM
        )

    def wait_using_parent_for_remove_object_to_finish_successfully(self, parent):
        self._wait_until_element_disappears(
            parent.check_if_element_exists_by_name,
            RightPanelTileWindowsDesktopPage.REMOVING_TEXT_ELEM
        )

    def wait_for_progress_notifications_to_disappear(self):
        right_panel_element = self.get_add_in_right_panel_element()

        self._wait_until_element_disappears(
            right_panel_element.check_if_element_exists_by_tag_name,
            RightPanelTileWindowsDesktopPage.PROGRESS_BAR_TAG_NAME
        )

    def _wait_until_element_disappears(self, check_if_element_exists_method, selector):
        end_time = time.time() + LONG_TIMEOUT

        while check_if_element_exists_method(selector, timeout=SHORT_TIMEOUT):
            if time.time() > end_time:
                raise MstrException(f'Error while waiting for operation [{check_if_element_exists_method}] to finish, '
                                    f'element still visible: [{selector}].')

    # todo: rename to close_all_success_notifications_on_hover
    def close_all_notifications_on_hover(self):
        tile_list = self.get_tile_list()

        # todo: get only tiles with notification instead of button from every tile
        elements = self.get_elements_by_name(RightPanelTileWindowsDesktopPage.DUPLICATE_BUTTON_ELEM)

        # scroll to top of tile list
        tile_list.click()
        self.press_home()

        notification_opened = self.is_any_successful_notification_open()

        while (notification_opened):
            for element in elements:
                element.move_to(offset_x=-20, offset_y=0)

            # scroll tile list to next page
            tile_list.click()
            self.press_page_down()

            notification_opened = self.is_any_successful_notification_open()

        # scroll to top of tile list
        tile_list.click()
        self.press_home()

    def close_all_warning_notifications(self):
        elements = self.get_elements_by_name(RightPanelTileWindowsDesktopPage.BUTTON_OK)

        for element in elements:
            element.click()

    def close_last_notification_on_hover(self):
        self.wait_for_progress_notifications_to_disappear()

        self._hover_over_tile(RightPanelTileWindowsDesktopPage.XML_FIRST_ELEMENT_INDEX)

    def close_object_notification_on_hover(self, object_no):
        self._hover_over_tile(object_no)

    def click_duplicate(self, tile_no):
        WindowsDesktopMainAddInElementCache.invalidate_cache()

        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.DUPLICATE_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def click_refresh(self, tile_no):
        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.REFRESH_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def hover_refresh(self, tile_no):
        self._hover_button_on_tile(RightPanelTileWindowsDesktopPage.REFRESH_BUTTON_ELEM, tile_no)

    def click_edit(self, tile_no):
        WindowsDesktopMainAddInElementCache.invalidate_cache()

        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.EDIT_BUTTON_ELEM, tile_no)

        plugin_window = self.check_if_element_exists_by_class_name(RightPanelTileWindowsDesktopPage.POPUP_WINDOW_ELEM)

        if not plugin_window:
            raise MstrException('MicroStrategy for office is not visible')

    def hover_edit(self, tile_no):
        self._hover_button_on_tile(RightPanelTileWindowsDesktopPage.EDIT_BUTTON_ELEM, tile_no)

    def get_tooltip_text(self, tile_no):
        object_tile_elem = self._get_object_tile_by_number(tile_no)
        tooltip_text_elem = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.TOOLTIP_TEXT)
        return tooltip_text_elem.text

    def remove_object_using_icon(self, tile_no):
        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.REMOVE_BUTTON_ELEM, tile_no)

        self.wait_for_remove_object_to_finish_successfully()

    def _click_button_on_tile(self, button_selector, tile_no):
        """
        Clicks button given by selector on tile number object_no.
        :param button_selector: Button selector.
        :param tile_no: Number of tile, counting from 1.
        """
        object_tile_elem = self._get_object_tile_by_number(tile_no)
        object_tile_elem.move_to(0, 0)

        button = object_tile_elem.get_element_by_name(button_selector)
        button.move_to(0, 0)
        # use simple_click to click button and quiclkly move cursor away from tile to not dismiss notification
        button.simple_click()
        object_tile_elem.move_to(0, 0)

    def _hover_button_on_tile(self, button_selector, tile_no):
        object_tile_elem = self._get_object_tile_by_number(tile_no)
        object_tile_elem.move_to(1, 1)

        button = object_tile_elem.get_element_by_name(button_selector)
        button.move_to(1, 1)
        self.pause(3)

    def _hover_over_tile(self, tile_no):
        self._get_object_tile_by_number(
            tile_no
        ).move_to()

    def get_object_name(self, index):
        right_panel_element = self.get_add_in_right_panel_element()

        object_name_element = right_panel_element.get_element_by_xpath(
            RightPanelTileWindowsDesktopPage.OBJECT_NAME_ELEM % index
        )

        return object_name_element.get_name_by_attribute()

    def click_object_number(self, object_no):
        self._get_object_tile_by_number(object_no).click()

    def double_click_on_name_of_object_number(self, object_no):
        self._get_object_tile_by_number(object_no).get_element_by_xpath(
            RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT
        ).double_click()

    def hover_over_object_number(self, object_no):
        self._hover_over_tile(object_no)

    def hover_over_name_of_object_number(self, object_no):
        """
        Hovers over name of object object_no in Right Panel.

        This method doesn't work when previous step selected the name by double clicking, //Button/Text disappears from
        page source. In this case, it necessary to unselect the name before calling this method, e.g. by selecting
        an Excel cell.

        If needed implementation for hovering after double clicking can be added, see:
        get_highlight_color_of_object_number_after_double_click().

        :param object_no: Right Panel object number.
        """
        self._get_object_tile_by_number(object_no).get_element_by_xpath(
            RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT
        ).move_to()

    def get_highlight_color_of_object_number(self, object_no):
        return self._get_object_tile_by_number(object_no).get_element_by_xpath(
            RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT
        ).pick_color(5, 2)

    def get_highlight_color_of_object_number_after_double_click(self, object_no):
        return self._get_object_tile_by_number(object_no).get_element_by_xpath(
            RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT_AFTER_DOUBLE_CLICK
        ).pick_color(5, 2)

    def change_object_name_using_icon(self, object_no, new_object_name):
        object_tile_elem = self._get_object_tile_by_number(object_no)

        name_container = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT)
        name_container.move_to()
        name_container.double_click()

        name_text = object_tile_elem.get_element_by_tag_name(RightPanelTileWindowsDesktopPage.TEXT_INPUT_TAG_NAME)
        name_text.send_keys(new_object_name)

        self.press_enter()

    def change_object_name_using_context_menu(self, object_no, new_object_name):
        object_tile_elem = self._get_object_tile_by_number(object_no)

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
        object_tile_elem = self._get_object_tile_by_number(object_no)

        name_container = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT)
        name_container.right_click(5, 5)  # Added small offset to ensure that right click occurs within searched element

        object_tile_elem.get_element_by_name(
            RightPanelTileWindowsDesktopPage.REMOVE_MENU_ITEM
        ).click()

        self.wait_using_parent_for_remove_object_to_finish_successfully(object_tile_elem)

    def get_object_name_from_tooltip(self, object_no):
        object_tile_elem = self._get_object_tile_by_number(object_no)

        name_container = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.NAME_INPUT_FOR_OBJECT)
        name_container.move_to()

        tooltip_text_elem = object_tile_elem.get_element_by_xpath(RightPanelTileWindowsDesktopPage.TOOLTIP_TEXT)

        return tooltip_text_elem.text

    def _get_object_tile_by_number(self, object_no):
        right_panel_element = self.get_add_in_right_panel_element()

        return right_panel_element.get_element_by_xpath(RightPanelTileWindowsDesktopPage.TILE_ELEM % object_no)

    def get_tile_list(self):
        right_panel_element = self.get_add_in_right_panel_element()
        return right_panel_element.get_element_by_xpath(RightPanelTileWindowsDesktopPage.TILE_LIST)

    def is_icon_bar_visible(self, object_no):
        # TODO: There is no way for now to recognize if bar is visible, is_display() on icon bar and its elements
        # is always returns true. This method should be updated when there will be added an element attribute making
        # it possible to distinguish if icon bar is visible.
        return True

    def is_any_successful_notification_open(self):
        is_open = False

        for text in RightPanelTileWindowsDesktopPage.NOTIFICATIONS_TEXTS:
            if (not is_open):
                is_open = self.check_if_element_exists_by_name(text, timeout=1)

        return is_open
