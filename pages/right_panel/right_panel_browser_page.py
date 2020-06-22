from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait

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

    def click_import_data_button_element(self):
        self._wait_for_add_in_frame_ready()
        self.click_element_by_css(RightPanelBrowserPage.IMPORT_DATA_BUTTON_ELEM)

    def click_add_data_button_element(self):
        self._wait_for_add_in_frame_ready()
        self.click_element_by_id(RightPanelBrowserPage.ADD_DATA_BUTTON_ELEM)

    def _wait_for_add_in_frame_ready(self):
        add_in_frame_ready_condition = TestExpectedCondition(
            self.focus_on_add_in_frame,
            self.get_visible_element_by_id,
            self.driver.find_element
        )

        wait = WebDriverWait(self.driver, 20)
        wait.until(add_in_frame_ready_condition)

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

        tiles = self.get_visible_elements_by_css(RightPanelBrowserPage.OBJECT_CONTAINER)
        other_container = self.get_visible_element_by_css(RightPanelBrowserPage.SIDE_PANEL_HEADER)

        for tile in tiles:
            self.move_to_element(other_container)
            self.move_to_element(tile)

    def close_last_notification_on_hover(self):
        self.focus_on_add_in_frame()

        self._hover_over_tile(0)

    def click_duplicate(self, object_no):
        self.focus_on_add_in_frame()

        self._hover_over_tile(int(object_no) - 1)

        self.click_element_by_css(RightPanelBrowserPage.DUPLICATE_BUTTON_FOR_OBJECT % object_no)

    def _hover_over_tile(self, tile_no):
        other_container = self.get_visible_element_by_css(RightPanelBrowserPage.SIDE_PANEL_HEADER)
        self.move_to_element(other_container)

        tiles = self.get_visible_elements_by_css(RightPanelBrowserPage.OBJECT_CONTAINER)
        self.move_to_element(tiles[tile_no])

    def click_edit(self, object_no):
        self.focus_on_add_in_frame()

        self.click_element_by_css(RightPanelBrowserPage.EDIT_BUTTON_FOR_OBJECT % object_no)

    def get_object_name(self, index):
        self.focus_on_add_in_frame()

        name_input = self.get_visible_element_by_css(RightPanelBrowserPage.NAME_INPUT_FOR_OBJECT % index)

        return name_input.text

    def logout(self):
        self.focus_on_add_in_frame()

        self.click_element_by_css(RightPanelBrowserPage.DOTS_MENU)

        self.click_element_by_id(RightPanelBrowserPage.DOTS_MENU_ITEM_LOG_OUT)


class TestExpectedCondition:
    # TODO refactor
    ADD_IN_OVERLAY_ELEM = 'overlay'
    CSS_OPACITY_ATTRIBUTE = 'opacity'
    DIALOG_OPEN_NOTIFICATION = '''//span[text()='A MicroStrategy for Office Add-in dialog is open']'''

    def __init__(self, focus_on_add_in_frame, get_visible_element_by_id, find_element):
        self.focus_on_add_in_frame = focus_on_add_in_frame
        self.get_visible_element_by_id = get_visible_element_by_id
        self.find_element = find_element

    def __call__(self, driver):
        self.focus_on_add_in_frame()

        overlay = self.get_visible_element_by_id(TestExpectedCondition.ADD_IN_OVERLAY_ELEM)
        if overlay.value_of_css_property(TestExpectedCondition.CSS_OPACITY_ATTRIBUTE) != '1':
            return False

        try:
            self.find_element(By.XPATH, self.DIALOG_OPEN_NOTIFICATION)
            return False
        except:
            return True
