from framework.pages_base.base_browser_page import BaseBrowserPage

from selenium.webdriver.common.keys import Keys
from framework.util.exception.mstr_exception import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
from time import sleep

class PageByBrowserPage(BaseBrowserPage):
    PAGE_BY_WINDOW = '.page-by-container'
    PAGE_BY_DROPDOWN = "//div[contains(@class, 'page-by-option-dropdown__container') and ancestor::div/div[@aria-label='%s']]//input"
    BUTTON = '//button[text()="%s"]'
    ICON_BUTTON = '//button[div/span[text()="%s"]]'
    ATTRIBUTE_CHECKBOX = '//input[@type="checkbox" and ancestor::li/div/span/span[text()="%s"]]'
    DROPDOWN_CLOSE_BUTTON = "//button[span[contains(@class, 'icon-common-arrow-down')] and ancestor::div/div[@aria-label='%s']]"
    GRID_CELL = '//span[@class="ag-cell-value" and text()="%s"]'
    GRID_ROW = '//div[@role="row" and contains(@class, "ag-row-level-0")]'
    SEARCH_INPUT = 'search-field__input'
    CLEAR_ICON = 'single-icon-common-clear'
    CHECHBOX_IN_GRID_ROW = '//div[@row-id="%s"]//input'
    
    def __init__(self):
        super().__init__()
        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()
    
    def is_page_by_window_visible(self):
        try:
            element = self.get_element_by_css(PageByBrowserPage.PAGE_BY_WINDOW)
            return element.is_displayed()
        except MstrException:
            return False
        
    def is_page_by_dropdown_visible(self, dropdown_name):
        element = self.get_element_by_xpath(PageByBrowserPage.PAGE_BY_DROPDOWN % dropdown_name)
        return element.is_displayed()
    
    def is_button_enabled(self, button_name):
        selector = PageByBrowserPage.BUTTON
        if button_name == 'Remove':
            selector = PageByBrowserPage.ICON_BUTTON
        element = self.get_element_by_xpath(selector % button_name)
        return element.is_enabled_by_attribute_html()
    
    def click_button(self, button_name):
        selector = PageByBrowserPage.BUTTON
        if button_name == 'Remove':
            selector = PageByBrowserPage.ICON_BUTTON
        element = self.get_element_by_xpath(selector % button_name)
        element.click()
        if button_name == 'Import':
            self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully()
    
    def click_button_without_checking(self, button_name):
        element = self.get_element_by_xpath(PageByBrowserPage.BUTTON % button_name)
        element.click()
        sleep(5)
    
    def click_page_by_dropdown(self, dropdown_name):
        element = self.get_element_by_xpath(PageByBrowserPage.PAGE_BY_DROPDOWN % dropdown_name)
        element.click()
    
    def click_dropdown_attribute(self, option):
        element = self.get_element_by_xpath(PageByBrowserPage.ATTRIBUTE_CHECKBOX % option)
        element.click()
    
    def close_page_by_dropdown(self, dropdown_name):
        element = self.get_element_by_xpath(PageByBrowserPage.DROPDOWN_CLOSE_BUTTON % dropdown_name)
        element.click()
    
    def get_amount_of_pages_in_grid(self):
        elements = self.get_elements_by_xpath(PageByBrowserPage.GRID_ROW)
        return len(elements)

    def search_for_string(self, search_string):
        search_input = self.get_element_by_class_name(PageByBrowserPage.SEARCH_INPUT)
        search_input.send_keys_with_check(search_string)
        search_input.send_keys(Keys.ENTER)

    def clear_search_input(self):
        clear_icon = self.get_element_by_class_name(PageByBrowserPage.CLEAR_ICON)
        clear_icon.click()
    
    def select_page(self, page_number):
        element = self.get_element_by_xpath(PageByBrowserPage.CHECHBOX_IN_GRID_ROW % page_number)
        element.click()
    