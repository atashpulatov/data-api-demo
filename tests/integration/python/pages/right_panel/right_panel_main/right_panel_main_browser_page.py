from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException


class RightPanelMainBrowserPage(BaseBrowserPage):
    IMPORT_DATA_BUTTON_ELEM = '.import-data > button'
    ADD_DATA_BUTTON_ELEM_ID = 'add-data-btn'

    DOTS_MENU = '.settings-button'
    DOTS_MENU_BOX = '.settings-list'
    DOTS_MENU_ITEM_LOG_OUT_ID = 'logOut'
    DOTS_MENU_SETTING = '.settings.not-linked-list'
    MENUT_SETTING_OPTION = '//button[normalize-space(.)="%s"]'

    SELECT_ALL_TILES = 'div.object-tile-container-header > span > span > '
    SELECT_ALL_TILES_CHECKBOX = '.object-tile-container-header .checkbox-cell'
    REFRESH_SELECTED_BUTTON = SELECT_ALL_TILES + 'button:nth-of-type(3)'
    REMOVE_SELECTED_BUTTON = SELECT_ALL_TILES + 'button:nth-of-type(4)'

    CLEAR_DATA = '.clear-data'
    CONFIRM_CLEAR_DATA_ID = 'confirm-btn'

    VIEW_DATA_BUTTON_ELEM = '.data-cleared > button'
    DATA_CLEARED_OVERLAY_TITLE = '.data-cleared .data-cleared-header'
    DATA_CLEARED_OVERLAY_MESSAGE = '.data-cleared .data-cleared-info'

    RIGHT_PANEL_OBJECT_LIST = '.object-tile-container .object-tile-list'

    ATTRIBUTE_NAME_CLIENT_HEIGHT = 'clientHeight'
    ATTRIBUTE_NAME_SCROLL_HEIGHT = 'scrollHeight'

    REUSE_PROMPT_ANSWER_TOGGLE = '.reuse-prompt-answers-toggle'
    REUSE_PROMPT_ANSWER_BACK = '.settings-icon span'

    IMPORTED_DATA_OVERVIEW = '.imported-data-overview'
    DEFAULT_IMPORT_FORMAT = "//li[@class='select-section__setting']//button"
    IMPORT_FORMAT_OPTION = "//li[@aria-label='%s']"

    PIVOT_TABLE_TOGGLES = "(//button[contains(@class, 'mstr-rc-3-switch--regular') and @type='button' and @role='switch' and ancestor::*[contains(text(), '%s')]][@aria-checked='true' or @aria-checked='false'])[1]"
    PARENT_TOGGLE = "//button[contains(@class, 'mstr-rc-3-switch--regular') and ancestor::label/div/span[contains(text(), '%s')]]"
    CHILD_TOGGLE = "//button[contains(@class, 'mstr-rc-3-switch--small') and ancestor::label/div[contains(text(), '%s')]]"
    DRAGGABLE_CHILD_TOGGLE = "//button[contains(@class, 'mstr-rc-3-switch--small') and ancestor::label/div[contains(text(), '%s')] and ancestor::li/button[contains(@class, 'mstr-rc-3-draggable-list__item-drag-handle')]]"
 
    OBJECT_TILE = "//article[contains(@class, 'object-tile')]"
    OBJECT_TILE_BY_NUMBER = "(//article[contains(@class, 'object-tile')])[%d]"
    CONTEXT_MENU = "//li[contains(@class, 'context-menu-item')]/span[text()='%s']"

    def click_import_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.IMPORT_DATA_BUTTON_ELEM).click()

    def click_add_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RightPanelMainBrowserPage.ADD_DATA_BUTTON_ELEM_ID).click()

    def refresh_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.SELECT_ALL_TILES_CHECKBOX).click()

        self.click_refresh_selected_button()

    def click_refresh_selected_button(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.REFRESH_SELECTED_BUTTON).click()

    def remove_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.SELECT_ALL_TILES_CHECKBOX).click()

        self.click_remove_selected_button()

    def click_remove_selected_button(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.REMOVE_SELECTED_BUTTON).click()

    def check_if_right_panel_is_empty(self):
        self.focus_on_add_in_frame()

        return self.check_if_element_exists_by_css(RightPanelMainBrowserPage.IMPORT_DATA_BUTTON_ELEM)

    def is_scrollbar_visible(self):
        self.focus_on_add_in_frame()

        side_panel_content = self.get_element_by_css(RightPanelMainBrowserPage.RIGHT_PANEL_OBJECT_LIST)

        client_height = side_panel_content.get_attribute(RightPanelMainBrowserPage.ATTRIBUTE_NAME_CLIENT_HEIGHT)
        scroll_height = side_panel_content.get_attribute(RightPanelMainBrowserPage.ATTRIBUTE_NAME_SCROLL_HEIGHT)

        return int(scroll_height) > int(client_height)

    def view_data(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.VIEW_DATA_BUTTON_ELEM).click()

    def clear_data(self):
        self._open_dots_menu()

        self.get_element_by_css(RightPanelMainBrowserPage.CLEAR_DATA).click()
        self.get_element_by_id(RightPanelMainBrowserPage.CONFIRM_CLEAR_DATA_ID).click()

    def logout(self):
        self.focus_on_add_in_frame()

        if not self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU, timeout=Const.SHORT_TIMEOUT):
            return

        self._open_dots_menu()

        self.get_element_by_id(RightPanelMainBrowserPage.DOTS_MENU_ITEM_LOG_OUT_ID).click()

    def hover_over_logout(self):
        self._open_dots_menu()

        self.get_element_by_id(RightPanelMainBrowserPage.DOTS_MENU_ITEM_LOG_OUT_ID).move_to()

    def _open_dots_menu(self):
        self.focus_on_add_in_frame()

        if not self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU, timeout=Const.SHORT_TIMEOUT):
            raise MstrException(
                'Error while opening Dots Menu, element not exists: ' + RightPanelMainBrowserPage.DOTS_MENU)

        if not self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU_BOX,
                                                   timeout=Const.SHORT_TIMEOUT):
            self.get_element_by_css(RightPanelMainBrowserPage.DOTS_MENU).click()

    def get_background_color_of_logout(self):
        element = self.get_element_by_id(RightPanelMainBrowserPage.DOTS_MENU_ITEM_LOG_OUT_ID)

        return element.get_background_color()

    def wait_for_clear_data_overlay_to_finish_successfully_with_title(self, overlay_title):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            RightPanelMainBrowserPage.DATA_CLEARED_OVERLAY_TITLE,
            Const.ATTRIBUTE_TEXT_CONTENT,
            overlay_title
        )

    def get_clear_data_overlay_message(self):
        self.focus_on_add_in_frame()

        element = self.get_element_by_css(RightPanelMainBrowserPage.DATA_CLEARED_OVERLAY_MESSAGE)
        overlay_message = element.get_text_content_by_attribute()

        return overlay_message
    
    def open_setting(self):
        self.focus_on_add_in_frame()

        self._open_dots_menu()
        self.get_element_by_css(RightPanelMainBrowserPage.DOTS_MENU_SETTING).click()

    def open_setting_menu_option(self, settings_option):
        self.focus_on_add_in_frame()

        self.get_element_by_xpath(RightPanelMainBrowserPage.MENUT_SETTING_OPTION % settings_option).click()

    def toggle_reuse_prompt_answer(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.REUSE_PROMPT_ANSWER_TOGGLE).click()

    def click_back_button(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelMainBrowserPage.REUSE_PROMPT_ANSWER_BACK).click()

    def get_reuse_prompt_answer_status(self):
        self.focus_on_add_in_frame()

        element = self.get_element_by_css(RightPanelMainBrowserPage.REUSE_PROMPT_ANSWER_TOGGLE)
        aria_checked_value = element.get_attribute("aria-checked")
        if aria_checked_value == "true":
            return True
        else:
            return False
    
    def click_imported_data_overview_settings_menu(self):
        self._open_dots_menu()

        self.get_element_by_css(RightPanelMainBrowserPage.IMPORTED_DATA_OVERVIEW).click()


    def select_default_import_format(self, import_format):
        self.focus_on_add_in_frame()

        self.get_element_by_xpath(RightPanelMainBrowserPage.DEFAULT_IMPORT_FORMAT).click()
        self.get_element_by_xpath(RightPanelMainBrowserPage.IMPORT_FORMAT_OPTION % import_format).click()

    def toggle_pivot_table_option(self, pivot_option):
        self.focus_on_add_in_frame()

        self.get_element_by_xpath(RightPanelMainBrowserPage.PIVOT_TABLE_TOGGLES % pivot_option).click()

    def is_toggle_pivot_table_option_enabled(self, pivot_option):
        self.focus_on_add_in_frame()

        element = self.get_element_by_xpath(RightPanelMainBrowserPage.PIVOT_TABLE_TOGGLES % pivot_option)
        aria_checked_value = element.get_attribute("aria-checked")
        return aria_checked_value == "true"

    def assert_toggle_pivot_table_option_enabled(self, pivot_option):
        assert self.is_toggle_pivot_table_option_enabled(pivot_option), "Toggle option is not enabled"

    def assert_toggle_pivot_table_option_disabled(self, pivot_option):
        assert not self.is_toggle_pivot_table_option_enabled(pivot_option), "Toggle option is enabled"
    
    def toggle_parent_setting(self, option, value):
        element = self.get_element_by_xpath(RightPanelMainBrowserPage.PARENT_TOGGLE % option)
        aria_checked_value = element.get_attribute("aria-checked")
        if aria_checked_value == 'true' and value == 'OFF':
            element.click()
        if aria_checked_value == 'false' and value == 'ON':
            element.click()
    
    def is_parent_toggle_option_checked(self, option):
        element = self.get_element_by_xpath(RightPanelMainBrowserPage.PARENT_TOGGLE % option)
        aria_checked_value = element.get_attribute("aria-checked")
        return aria_checked_value == "true"
    
    def toggle_child_setting(self, option, value):
        element = self.get_element_by_xpath(RightPanelMainBrowserPage.CHILD_TOGGLE % option)
        aria_checked_value = element.get_attribute("aria-checked")
        if aria_checked_value == 'true' and value == 'OFF':
            element.click()
        if aria_checked_value == 'false' and value == 'ON':
            element.click()
    
    def is_child_toggle_option_checked(self, option):
        element = self.get_element_by_xpath(RightPanelMainBrowserPage.CHILD_TOGGLE % option)
        aria_checked_value = element.get_attribute("aria-checked")
        return aria_checked_value == "true"
    
    def is_draggable_child_toggle_option_checked(self, option):
        element = self.get_element_by_xpath(RightPanelMainBrowserPage.DRAGGABLE_CHILD_TOGGLE % option)
        aria_checked_value = element.get_attribute("aria-checked")
        return aria_checked_value == "true"
    
    def get_number_of_object_tiles(self):
        self.focus_on_add_in_frame()
        number_of_object_tiles = len(self.get_elements_by_xpath(RightPanelMainBrowserPage.OBJECT_TILE))
        return number_of_object_tiles

    def click_context_menu_item(self, context_menu_option, object_number):
        element = self.get_element_by_xpath(RightPanelMainBrowserPage.OBJECT_TILE_BY_NUMBER % object_number)
        element.right_click()
        self.get_element_by_xpath(RightPanelMainBrowserPage.CONTEXT_MENU % context_menu_option).click()