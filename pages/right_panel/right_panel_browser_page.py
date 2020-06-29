from pages.base_browser_page import BaseBrowserPage
from util.const import DEFAULT_TIMEOUT


class RightPanelBrowserPage(BaseBrowserPage):
    IMPORT_DATA_BUTTON_ELEM = '#overlay > div.side-panel > div.import-data > button'
    ADD_DATA_BUTTON_ELEM = 'add-data-btn'

    NOTIFICATION_TEXT_ELEM = '.notification-text'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'
    IMPORT_SUCCESSFUL_TEXT = 'Import successful'
    DUPLICATE_OBJECT_SUCCESSFUL_TEXT = 'Object duplicated'

    OBJECT_CONTAINER = '.object-tile-content'
    OBJECT_CONTAINER_NTH = '.object-tile-content:nth-child(%s)'
    NOTIFICATION_CONTAINER = '.notification-container'

    SIDE_PANEL_HEADER = '.side-panel > .header'

    RIGHT_PANEL_TILE_PREFIX = '#overlay > div.side-panel > div.object-tile-container > ' \
                              'div.object-tile-list > article:nth-child(%s) > div > div > '

    RIGHT_PANEL_TILE_BUTTON_PREFIX = RIGHT_PANEL_TILE_PREFIX + 'div.object-tile-header > span.icon-bar-container > ' \
                                                               'span > '

    DUPLICATE_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(1)'

    EDIT_BUTTON_FOR_OBJECT = RIGHT_PANEL_TILE_BUTTON_PREFIX + 'button:nth-child(3)'

    NAME_INPUT_FOR_OBJECT = RIGHT_PANEL_TILE_PREFIX + 'div.object-tile-name-row > div.rename-input'

    DOTS_MENU = '#overlay > div > div.header > div.settings > button > span > svg'
    DOTS_MENU_ITEM_LOG_OUT = 'logOut'

    ADD_IN_OVERLAY_ELEM = 'overlay'
    CSS_OPACITY_ATTRIBUTE = 'opacity'
    DIALOG_OPEN_NOTIFICATION = '''//span[text()='A MicroStrategy for Office Add-in dialog is open']'''

    def click_import_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_css(RightPanelBrowserPage.IMPORT_DATA_BUTTON_ELEM).click()

    def click_add_data_button_element(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(RightPanelBrowserPage.ADD_DATA_BUTTON_ELEM).click()

    def wait_for_import_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(RightPanelBrowserPage.NOTIFICATION_TEXT_ELEM,
                                                             RightPanelBrowserPage.TEXT_CONTENT_ATTRIBUTE,
                                                             RightPanelBrowserPage.IMPORT_SUCCESSFUL_TEXT,
                                                             timeout=timeout)

    def wait_for_duplicate_object_to_finish_successfully(self, timeout=DEFAULT_TIMEOUT):
        self.focus_on_add_in_frame()

        self.wait_for_element_to_have_attribute_value_by_css(RightPanelBrowserPage.NOTIFICATION_TEXT_ELEM,
                                                             RightPanelBrowserPage.TEXT_CONTENT_ATTRIBUTE,
                                                             RightPanelBrowserPage.DUPLICATE_OBJECT_SUCCESSFUL_TEXT,
                                                             timeout=timeout)

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

    def logout(self):
        self.focus_on_add_in_frame()

        if self.check_if_element_exists_by_css(RightPanelBrowserPage.DOTS_MENU, timeout=5):
            self.get_element_by_css(RightPanelBrowserPage.DOTS_MENU).click()

            self.get_element_by_id(RightPanelBrowserPage.DOTS_MENU_ITEM_LOG_OUT).click()
