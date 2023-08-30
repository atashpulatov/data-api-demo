from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException


class RightPanelMainBrowserPage(BaseBrowserPage):
    IMPORT_DATA_BUTTON_ELEM = '.import-data > span > button'
    ADD_DATA_BUTTON_ELEM_ID = 'add-data-btn'

    DOTS_MENU = '.settings-button'
    DOTS_MENU_BOX = '.settings-list'
    DOTS_MENU_ITEM_LOG_OUT_ID = 'logOut'

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
