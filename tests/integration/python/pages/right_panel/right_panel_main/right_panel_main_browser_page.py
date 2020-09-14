from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException


class RightPanelMainBrowserPage(BaseBrowserPage):
    IMPORT_DATA_BUTTON_ELEM = '.import-data > button'
    ADD_DATA_BUTTON_ELEM_ID = 'add-data-btn'

    DOTS_MENU = '.settings-button'
    DOTS_MENU_BOX = '.settings-list'
    DOTS_MENU_ITEM_LOG_OUT_ID = 'logOut'

    SELECT_ALL_TILES = 'div.object-tile-container-header > span > span > '
    SELECT_ALL_TILES_CHECKBOX_ID = 'master-checkbox'
    REFRESH_ALL = SELECT_ALL_TILES + 'button:nth-child(5)'
    REMOVE_ALL = SELECT_ALL_TILES + 'button:nth-child(6)'

    CLEAR_DATA = '.clear-data'
    CONFIRM_CLEAR_DATA_ID = 'confirm-btn'

    VIEW_DATA_BUTTON_ELEM = '.data-cleared > button'

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

        self.get_element_by_id(RightPanelMainBrowserPage.SELECT_ALL_TILES_CHECKBOX_ID).click()

        self.get_element_by_css(RightPanelMainBrowserPage.REFRESH_ALL).click()

    def remove_all(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RightPanelMainBrowserPage.SELECT_ALL_TILES_CHECKBOX_ID).click()

        self.get_element_by_css(RightPanelMainBrowserPage.REMOVE_ALL).click()

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
        self.get_element_by_id(RightPanelMainBrowserPage._ID).click()

    def logout(self):
        self.focus_on_add_in_frame()

        if not self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU, timeout=SHORT_TIMEOUT):
            return

        self._open_dots_menu()

        self.get_element_by_id(RightPanelMainBrowserPage.DOTS_MENU_ITEM_LOG_OUT_ID).click()

    def hover_over_logout(self):
        self._open_dots_menu()

        self.get_element_by_id(RightPanelMainBrowserPage.DOTS_MENU_ITEM_LOG_OUT_ID).move_to()

    def _open_dots_menu(self):
        self.focus_on_add_in_frame()

        if not self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU, timeout=SHORT_TIMEOUT):
            raise MstrException(
                'Error while opening Dots Menu, element not exists: ' + RightPanelMainBrowserPage.DOTS_MENU)

        if not self.check_if_element_exists_by_css(RightPanelMainBrowserPage.DOTS_MENU_BOX, timeout=SHORT_TIMEOUT):
            self.get_element_by_css(RightPanelMainBrowserPage.DOTS_MENU).click()

    def get_background_color_of_logout(self):
        element = self.get_element_by_id(RightPanelMainBrowserPage.DOTS_MENU_ITEM_LOG_OUT_ID)

        return element.get_background_color()
