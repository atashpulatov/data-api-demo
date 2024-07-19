import re

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.message_const import MessageConst
from framework.util.exception.mstr_exception import MstrException
import html

class RightPanelTileBrowserPage(BaseBrowserPage):
    NOTIFICATION_CONTAINER_CLASS_NAME = 'notification-container'
    NOTIFICATION_TEXT_ELEM = '.notification-text'
    NOTIFICATION_WARNING_BUTTON = '.warning-notification-button-container'
    PROGRESS_BAR = '.progress-bar'

    GLOBAL_ERROR_ELEM = '.global-warning-title'
    GLOBAL_WARNING_BUTTON = '.global-warning-buttons'

    TILES = '.object-tile-content'

    SIDE_PANEL_HEADER = '.side-panel > .header'
    IMPORT_SUCCESSFUL_MESSAGE = '//span[text()="Import successful"]'

    RIGHT_PANEL_TILE = '.object-tile-list > article:nth-child(%s) > div > .object-tile-wrapper'
    RIGHT_PANEL_TILE_GROUP = '.mstr-cc-object-tile-groups > .mstr-cc-object-tile-group:nth-child(%s) '
    RIGHT_PANEL_TILE_IN_GROUP = RIGHT_PANEL_TILE_GROUP + RIGHT_PANEL_TILE
    RIGHT_PANEL_TILE_NOTIFICATION = '.object-tile-list > article:nth-child(%s) > div > .notification-container'

    RIGHT_PANEL_TILE_ICON_BAR_CONTAINER = RIGHT_PANEL_TILE + ' > .object-tile-content > .object-tile-header > .icon-bar-container > '
    RIGHT_PANEL_TILE_CONTEXT_MENU_CONTAINER = RIGHT_PANEL_TILE_ICON_BAR_CONTAINER + '.multiselection-context-menu > .context-menu-container > '

    RIGHT_PANEL_TILE_BUTTON_PREFIX = RIGHT_PANEL_TILE_ICON_BAR_CONTAINER + '.icon-bar > '

    RIGHT_PANEL_TILE_NOTIFICATION_CANCEL_BUTTON = RIGHT_PANEL_TILE_NOTIFICATION + \
                                                  ' .progress-bar-notification-button-container > button'

    RIGHT_PANEL_TILE_PROGRESS_PROCESSED_ITEMS = RIGHT_PANEL_TILE_NOTIFICATION + \
                                                ' .notification-body .progress-processed-items'

    RIGHT_PANEL_TILE_PROGRESS_ACTION = RIGHT_PANEL_TILE_NOTIFICATION + ' .notification-text .left-text'
    RIGHT_PANEL_TILE_PROGRESS_PERCENTAGE = RIGHT_PANEL_TILE_NOTIFICATION + ' .notification-text .right-text'
    RIGHT_PANEL_TILE_IN_GROUP_PROGRESS_ACTION = RIGHT_PANEL_TILE_GROUP + RIGHT_PANEL_TILE_PROGRESS_ACTION
    RIGHT_PANEL_TILE_FIRST_DIV = '.object-tile-list > article:nth-child(%s) > div > div:nth-child(1)'

    PROGRESS_COUNT_SEPARATOR = '/'

    #Change index due to implementation of F38412 Re-use prompt answers across multiple prompts when importing content via the MicroStrategy add-in for Excel
    REPROMPT_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-of-type(1)'
    REFRESH_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + '''button[aria-label='Refresh button']'''
    OPTIONS_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + '''button[aria-label='Misc menu button']'''
    EDIT_OPTION_FOR_OBJECT = RIGHT_PANEL_TILE_CONTEXT_MENU_CONTAINER + '.context-menu-wrapper > .context-menu-list >' + '''li[aria-label='Edit']'''
    DUPLICATE_OPTION_FOR_OBJECT = RIGHT_PANEL_TILE_CONTEXT_MENU_CONTAINER + '.context-menu-wrapper > .context-menu-list >' + '''li[aria-label='Duplicate']'''
    CHECKBOX_FOR_OBJECT = RIGHT_PANEL_TILE + ' .mstr-rc-3-selector'
    SELECT_ALL_CHECKBOX = '#master-checkbox'
    REPROMPT_BUTTON_FOR_ALL = '.multiselection-reprompt-button'
    REFRESH_BUTTON_FOR_ALL = '.multiselection-refresh-button'

    REFRESH_BUTTON_FOR_OBJECT_IN_GROUP = RIGHT_PANEL_TILE_GROUP + REFRESH_BUTTON_FOR_OBJECT
    OPTIONS_BUTTON_FOR_OBJECT_IN_GROUP = RIGHT_PANEL_TILE_GROUP + OPTIONS_BUTTON_FOR_OBJECT
    EDIT_OPTION_FOR_OBJECT_IN_GROUP = RIGHT_PANEL_TILE_GROUP + EDIT_OPTION_FOR_OBJECT
    DUPLICATE_OPTION_FOR_OBJECT_IN_GROUP = RIGHT_PANEL_TILE_GROUP + DUPLICATE_OPTION_FOR_OBJECT
    
    NOTIFICATION_BUTTON = 'notification-container'

    NAME_INPUT_FOR_OBJECT = RIGHT_PANEL_TILE + ' .rename-input.view-only'
    NAME_INPUT_TEXT_FOR_OBJECT = RIGHT_PANEL_TILE + ' .rename-input.editable'

    VISUALIZATION_PATH_FOR_OBJECT = RIGHT_PANEL_TILE + ' .visualization-path'

    RIGHT_PANEL_TILE_TOOLTIP = RIGHT_PANEL_TILE + ' .object-tile-name-row .__react_component_tooltip'
    RIGHT_PANEL_TILE_SUB_TITLE = '.mstr-rc-overflow-tooltip__child-container'

    TILE_CONTEXT_MENU_OPTION_REFRESH = '//div[@class="context-menu-container"]//span[contains(text(), "Refresh")]'
    TILE_CONTEXT_MENU_OPTION_RENAME = '//div[@class="context-menu-container"]//span[contains(text(), "Rename")]'
    TILE_CONTEXT_MENU_OPTION_REMOVE = '//div[@class="context-menu-container"]//span[contains(text(), "Delete")]'
    TILE_CONTEXT_MENU_OPTION_DUPLICATE = '//div[@class="context-menu-container"]//span[contains(text(), "Duplicate")]'
    TILE_CONTEXT_MENU_OPTION_EDIT = '//div[@class="context-menu-container"]//span[contains(text(), "Edit")]'

    TILE_CONTEXT_MENU_WRAPPER = '.object-tile-list .object-tile'

    NORMAL_TILE_CONTEXT_MENU_ITEMS = '.context-menu-item'


    OBJECT_TILE_ACTIONS = '.icon-bar'

    PERCENTAGE_ZERO = '0%'
    PERCENTAGE_NUMBER = '^\d{1,3}%$'

    ACTION_STATUS_PENDING = 'Pending'

    TOOLTIP_CSS = '.__react_component_tooltip'

    PIVOT_TABLE_HEADER = '#FieldListTaskPaneTaskPaneTitle'
    PIVOT_TABLE_FIELD_XPATH = '//div[@data-automationid="ListCell"][.//div[@title="%s"]]//input[@type="checkbox"]'
    PIVOT_TABLE_OPTION_IN_SECTION_XPATH = '//div[@data-testid="fieldWell"][.//div[text()="%s"]][.//div[text()="%s"]]'
    PIVOT_TABLE_CLOSE_BUTTON_XPATH = '//button[@aria-label="Close"]'

    SETTINGS_BUTTON = '.settings-button'

    def wait_for_import_to_finish_successfully(self, timeout=Const.LONG_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.IMPORT_SUCCESSFUL_TEXT, timeout)

    def wait_for_duplicate_object_to_finish_successfully(self, timeout=Const.DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.DUPLICATE_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_refresh_object_to_finish_successfully(self, timeout=Const.DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.REFRESH_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_import_object_to_finish_successfully(self, timeout=Const.DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.IMPORT_SUCCESSFUL_TEXT, timeout)

    def wait_for_remove_object_to_finish_successfully(self, timeout=Const.DEFAULT_TIMEOUT):
        self._wait_for_operation_with_status(MessageConst.REMOVE_OBJECT_SUCCESSFUL_TEXT, timeout)

    def wait_for_operation_to_finish_successfully_with_message(self, expected_message, timeout=Const.LONG_TIMEOUT):
        self._wait_for_operation_with_status(expected_message, timeout)

    def wait_for_operation_error_and_accept(self, expected_message, timeout=Const.DEFAULT_TIMEOUT):
        self._wait_for_operation_with_error(expected_message, timeout)

        self.get_element_by_css(RightPanelTileBrowserPage.NOTIFICATION_WARNING_BUTTON).click()

    def wait_for_operation_global_error_and_accept(self, expected_message, timeout=Const.DEFAULT_TIMEOUT):
        self._wait_for_operation_with_global_error(expected_message, timeout)

        self.get_element_by_css(RightPanelTileBrowserPage.GLOBAL_WARNING_BUTTON).click()

    def _wait_for_operation_with_status(self, expected_message, timeout):
        self.focus_on_add_in_frame()

        self.find_element_by_text_in_elements_list_by_css(
            RightPanelTileBrowserPage.NOTIFICATION_TEXT_ELEM,
            expected_message,
            timeout=timeout
        )

    def _wait_for_operation_with_global_error(self, expected_message, timeout):
        self.focus_on_add_in_frame()

        self.find_element_by_text_in_elements_list_by_css(
            RightPanelTileBrowserPage.GLOBAL_ERROR_ELEM,
            expected_message,
            timeout=timeout
        )

    def _wait_for_operation_with_error(self, expected_message, timeout):
        self.focus_on_add_in_frame()

        self.find_element_by_text_in_elements_list_by_css(
            RightPanelTileBrowserPage.NOTIFICATION_TEXT_ELEM,
            expected_message,
            timeout=timeout
        )

    def _wait_for_global_error(self, expected_message, timeout):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            RightPanelTileBrowserPage.GLOBAL_ERROR_ELEM,
            Const.ATTRIBUTE_TEXT_CONTENT,
            expected_message,
            timeout=timeout
        )

    def wait_for_progress_notifications_to_disappear(self, timeout=Const.DEFAULT_TIMEOUT):
        self.focus_on_add_in_frame()

        self.wait_for_elements_to_disappear_from_dom(RightPanelTileBrowserPage.PROGRESS_BAR, timeout=timeout)

    def close_all_notifications_on_hover(self):
        self.focus_on_add_in_frame()

        tiles = self.get_elements_by_css(RightPanelTileBrowserPage.TILES)
        other_container = self.get_element_by_css(RightPanelTileBrowserPage.SIDE_PANEL_HEADER)

        for tile in tiles:
            other_container.move_to()
            tile.move_to()
            other_container.move_to()

    def hover_over_import_successful_message(self):

        self.focus_on_add_in_frame()

        tiles = self.get_elements_by_css(RightPanelTileBrowserPage.TILES)
        other_container = self.get_element_by_xpath(RightPanelTileBrowserPage.IMPORT_SUCCESSFUL_MESSAGE)

        other_container.move_to()
        tiles[0].move_to()

    def close_last_notification_on_hover(self, not_used_reset_framework_method, not_used_context):
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

    def click_refresh(self, tile_no):
        self.focus_on_add_in_frame()
        self._hover_over_tile(int(tile_no) - 1)

        refresh_selector = RightPanelTileBrowserPage.REFRESH_BUTTON_FOR_OBJECT % tile_no
        
        refresh_element = self.get_element_by_css(refresh_selector)
        refresh_element.click()

    def hover_refresh(self, tile_no):
        self._hover_over_tile_button(RightPanelTileBrowserPage.REFRESH_BUTTON_FOR_OBJECT, tile_no)

    def click_reprompt(self, tile_no):
        self._click_tile_button(RightPanelTileBrowserPage.REPROMPT_BUTTON_FOR_OBJECT, tile_no)
    
    def hover_reprompt(self, tile_no):
        self._hover_over_tile_button(RightPanelTileBrowserPage.REPROMPT_BUTTON_FOR_OBJECT, tile_no)

    def click_select_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelTileBrowserPage.SELECT_ALL_CHECKBOX).click()

    def click_reprompt_for_select_all(self):
        self.get_element_by_css(RightPanelTileBrowserPage.REPROMPT_BUTTON_FOR_ALL).click()

    def click_refresh_for_select_all(self):
        self.get_element_by_css(RightPanelTileBrowserPage.REFRESH_BUTTON_FOR_ALL).click()
        
    def click_edit(self, tile_no):
        self.click_options_for_object(tile_no)
        self.get_element_by_css(RightPanelTileBrowserPage.EDIT_OPTION_FOR_OBJECT % tile_no).click()

    def hover_edit(self, tile_no):
        self._hover_over_tile_button(RightPanelTileBrowserPage.OPTIONS_BUTTON_FOR_OBJECT, tile_no)

    def click_checkbox_for_object_selection(self, tile_no):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelTileBrowserPage.CHECKBOX_FOR_OBJECT % tile_no).click()

    def click_options_for_object(self, tile_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(tile_no) - 1)
        selector = RightPanelTileBrowserPage.OPTIONS_BUTTON_FOR_OBJECT % tile_no

        self.get_elements_by_css(selector)[int(tile_no) - 1].click()

    def click_options_for_object_in_group(self, tile_no, group_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile_in_group(tile_no, group_no)

        self.get_element_by_css(
            RightPanelTileBrowserPage.OPTIONS_BUTTON_FOR_OBJECT_IN_GROUP % (group_no, tile_no)
        ).click()

    def click_cancel_on_pending_action(self, tile_no):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE_NOTIFICATION_CANCEL_BUTTON % tile_no).click()

    def _click_tile_button(self, selector, tile_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(tile_no) - 1)

        self.get_element_by_css(selector % tile_no).click()

    def _hover_over_tile_button(self, selector, tile_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(tile_no) - 1)

        self.get_element_by_css(selector % tile_no).move_to()

    def get_tooltip_text(self, tile_no):
        self.focus_on_add_in_frame()

        tiles = self.get_elements_by_css(RightPanelTileBrowserPage.TILES)
        selected_tile = tiles[int(tile_no) - 1]

        tooltip_text_elem = selected_tile.get_elements_by_css(RightPanelTileBrowserPage.TOOLTIP_CSS)
        for element in tooltip_text_elem:
            if element.text != '':
                return element.text

        raise MstrException(f'Could not find a tooltip in tile number: {tile_no}')

    def _hover_over_tile(self, tile_no):
        other_container = self.get_element_by_css(RightPanelTileBrowserPage.SIDE_PANEL_HEADER)
        other_container.move_to()

        tiles = self.get_elements_by_css(RightPanelTileBrowserPage.TILES)
        tiles[tile_no].move_to()

    def _hover_over_tile_in_group(self, tile_no, group_no):
        other_container = self.get_element_by_css(RightPanelTileBrowserPage.SIDE_PANEL_HEADER)
        other_container.move_to()

        tile = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE_IN_GROUP % (group_no, tile_no))
        tile.move_to()

    def get_object_name(self, index):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % index)

        return name_input.text

    def click_object_number(self, object_no):
        self.focus_on_add_in_frame()

        object_index = int(object_no) - 1

        tile_context_menu_wrappers = self.get_elements_by_css(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_WRAPPER
        )

        tile_context_menu_wrappers[object_index].click()

    def double_click_on_name_of_object_number(self, object_no):
        self.focus_on_add_in_frame()

        name_container = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % object_no)
        name_container.double_click()

    def hover_over_name_of_object_number(self, object_no):
        self.focus_on_add_in_frame()

        name_container = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % object_no)
        name_container.move_to()

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

        self.get_element_by_xpath(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_RENAME
        ).move_to_and_click()

        name_text = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_TEXT_FOR_OBJECT % object_number)
        name_text.send_keys(new_object_name)

        self.press_enter()

    def refresh_object_using_context_menu(self, object_number):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.get_element_by_xpath(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_REFRESH
        ).move_to_and_click()
    
    def remove_object_using_context_menu(self, object_number):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.get_element_by_xpath(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_REMOVE
        ).move_to_and_click()

    def duplicate_object_using_context_menu_without_prompt(self, object_number):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.get_element_by_xpath(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_DUPLICATE
        ).move_to_and_click()

    def edit_object_using_context_menu_without_prompt(self, object_number):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % object_number)
        name_input.right_click()

        self.get_element_by_xpath(
            RightPanelTileBrowserPage.TILE_CONTEXT_MENU_OPTION_EDIT
        ).move_to_and_click()

    def get_object_name_from_tooltip(self, object_number):
        self.focus_on_add_in_frame()

        name_container = self.get_element_by_css(RightPanelTileBrowserPage.NAME_INPUT_FOR_OBJECT % object_number)
        name_container.move_to()

        object_name = self._get_name_tooltip_text(object_number)

        return object_name

    def get_object_path(self, object_number):
        self.focus_on_add_in_frame()
        
        path_name = self.get_element_by_css(RightPanelTileBrowserPage.VISUALIZATION_PATH_FOR_OBJECT % object_number)

        return path_name.text
    
    def get_object_path_from_innerHtml(self, object_number):
        self.focus_on_add_in_frame()
        
        path_name = self.get_element_by_css(RightPanelTileBrowserPage.VISUALIZATION_PATH_FOR_OBJECT % object_number)

        return path_name.get_attribute("innerHTML")
    
    def get_object_sub_title(self, title):
        self.focus_on_add_in_frame()
        
        elements = self.get_elements_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE_SUB_TITLE)
        for element in elements:
            if html.unescape(element.get_attribute("innerHTML")) == title:
                return element

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

    def get_object_action_in_progress_name(self, object_number):
        self.focus_on_add_in_frame()

        return self._get_action_status(object_number)

    def get_object_action_in_progress_total_rows_count(self, object_number):
        self.focus_on_add_in_frame()

        element = self.get_element_by_css(
            RightPanelTileBrowserPage.RIGHT_PANEL_TILE_PROGRESS_PROCESSED_ITEMS % object_number
        )

        rows_count = element.get_text_content_by_attribute()
        rows_count_list = rows_count.split(RightPanelTileBrowserPage.PROGRESS_COUNT_SEPARATOR)
        total_rows = rows_count_list[1]

        return total_rows

    def verify_object_action_displays_progress_percentage(self, object_number):
        self.focus_on_add_in_frame()

        percentage = self._get_progress_percentage(object_number)

        return re.match(RightPanelTileBrowserPage.PERCENTAGE_NUMBER, percentage) is not None

    def verify_object_action_is_pending(self, object_number):
        self.focus_on_add_in_frame()

        percentage = self._get_progress_percentage(object_number)
        action_status = self._get_action_status(object_number)

        return percentage == RightPanelTileBrowserPage.PERCENTAGE_ZERO and \
               action_status == RightPanelTileBrowserPage.ACTION_STATUS_PENDING

    def _get_progress_percentage(self, object_number):
        percentage_element = self.get_element_by_css(
            RightPanelTileBrowserPage.RIGHT_PANEL_TILE_PROGRESS_PERCENTAGE % object_number
        )
        return percentage_element.get_text_content_by_attribute()

    def _get_action_status(self, object_number):
        action_status_element = self.get_element_by_css(
            RightPanelTileBrowserPage.RIGHT_PANEL_TILE_PROGRESS_ACTION % object_number
        )
        return action_status_element.get_text_content_by_attribute()

    def verify_object_has_popup_displayed(self, object_number):
        self.focus_on_add_in_frame()

        element = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE_FIRST_DIV % object_number)
        element_class_name = element.get_class_name_by_attribute()

        return element_class_name == RightPanelTileBrowserPage.NOTIFICATION_CONTAINER_CLASS_NAME

    def wait_for_object_operation_to_finish_successfully_with_message(self, object_number, expected_message):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            RightPanelTileBrowserPage.RIGHT_PANEL_TILE_PROGRESS_ACTION % object_number,
            Const.ATTRIBUTE_TEXT_CONTENT,
            expected_message
        )

    def get_right_click_menu_items(self):
        self.focus_on_add_in_frame()

        name_input = self.get_element_by_css(RightPanelTileBrowserPage.RIGHT_PANEL_TILE % 1)
        name_input.right_click()

        return len(self.get_elements_by_css(RightPanelTileBrowserPage.NORMAL_TILE_CONTEXT_MENU_ITEMS))

    def get_context_menu_item_for_name(self, item_name):
        self.focus_on_add_in_frame()

        items = self.get_elements_by_css(RightPanelTileBrowserPage.NORMAL_TILE_CONTEXT_MENU_ITEMS)
        for item in items:
            if item.get_attribute('aria-label') == item_name:
                return True
        return False
    
    def is_pivot_table_present(self):

        pivot_table_header = self.get_element_by_css(RightPanelTileBrowserPage.PIVOT_TABLE_HEADER)
        
        if pivot_table_header:
            return pivot_table_header.is_displayed()
        else:
            return False
        
    def open_settings_menu(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelTileBrowserPage.SETTINGS_BUTTON).click()
        self.get_element_by_name('Settings').click()

    def toggle_pivot_table_checkbox(self, option):
        self.focus_on_add_in_frame()

        self.get_element_by_xpath(RightPanelTileBrowserPage.PIVOT_TABLE_FIELD_XPATH % option).click()

    def is_option_present_in_section(self, option, section_name):
        self.focus_on_add_in_frame()

        return self.check_if_element_exists_by_xpath(RightPanelTileBrowserPage.PIVOT_TABLE_OPTION_IN_SECTION_XPATH % (option, section_name))
    
    def get_object_message(self, object_number, group_number):
        self.focus_on_add_in_frame()

        element = self.get_element_by_css(
            RightPanelTileBrowserPage.RIGHT_PANEL_TILE_IN_GROUP_PROGRESS_ACTION % (group_number, object_number)
        )
        return element.get_text_content_by_attribute()
    
    def click_refresh_in_group(self, object_number, group_number):
        self._hover_over_tile_in_group(object_number, group_number)

        self.get_element_by_css(
            RightPanelTileBrowserPage.REFRESH_BUTTON_FOR_OBJECT_IN_GROUP % (group_number, object_number)
        ).click()
    
    def click_edit_in_group(self, object_number, group_number):
        self.click_options_for_object_in_group(object_number, group_number)

        self.get_element_by_css(
            RightPanelTileBrowserPage.EDIT_OPTION_FOR_OBJECT_IN_GROUP % (group_number, object_number)
        ).click()

    def click_duplicate_in_group(self, object_number, group_number):
        self.click_options_for_object_in_group(object_number, group_number)

        self.get_element_by_css(
            RightPanelTileBrowserPage.DUPLICATE_OPTION_FOR_OBJECT_IN_GROUP % (group_number, object_number)
        ).click()

    def close_object_notification_in_group_on_hover(self, object_number, group_number):
        self.focus_on_add_in_frame()

        self._hover_over_tile_in_group(object_number, group_number)

    def close_pivot_window(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelTileBrowserPage.PIVOT_TABLE_CLOSE_BUTTON_XPATH).click()
