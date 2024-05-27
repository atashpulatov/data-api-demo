from framework.pages_base.base_browser_page import BaseBrowserPage

from framework.util.exception.mstr_exception import MstrException

class PageByBrowserPage(BaseBrowserPage):
    PAGE_BY_WINDOW = '.page-by-container'
    PAGE_BY_DROPDOWN = '.page-by-option-dropdown__container'
    BUTTON = '//button[text()="%s"]'
    ICON_BUTTON = '//button[div/span[text()="%s"]]'
    ATTRIBUTE_CHECKBOX = '//input[@type="checkbox" and ancestor::li/div/span/span[text()="%s"]]'
    DROPDOWN_CLOSE_BUTTON = '//button[span[contains(@class, "icon-common-arrow-down")]]'
    GRID_CELL = '//span[@class="ag-cell-value" and text()="%s"]'
    
    def is_page_by_window_visible(self):
        try:
            element = self.get_element_by_css(PageByBrowserPage.PAGE_BY_WINDOW)
            return element.is_displayed()
        except MstrException:
            return False
        
    
    def is_page_by_dropdown_visible(self):
        element = self.get_element_by_css(PageByBrowserPage.PAGE_BY_DROPDOWN)
        return element.is_displayed()
    
    def is_button_enabled(self, button_name):
        selector = PageByBrowserPage.BUTTON
        if button_name == 'Remove':
            selector = PageByBrowserPage.ICON_BUTTON
        element = self.get_element_by_xpath(selector % button_name)
        return element.is_enabled_by_attribute_html()
    
    def click_button(self, button_name):
        element = self.get_element_by_xpath(PageByBrowserPage.BUTTON % button_name)
        element.click()
        if button_name == 'Import':
            self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully()
    
    def click_page_by_dropdown(self):
        element = self.get_element_by_css(PageByBrowserPage.PAGE_BY_DROPDOWN)
        element.click()
    
    def click_dropdown_attribute(self, option):
        element = self.get_element_by_xpath(PageByBrowserPage.ATTRIBUTE_CHECKBOX % option)
        element.click()
    
    def close_page_by_dropdown(self):
        element = self.get_element_by_xpath(PageByBrowserPage.DROPDOWN_CLOSE_BUTTON)
        element.click()
    
    def is_value_in_grid_displayed(self, grid_cell_value):
        element = self.get_element_by_xpath(PageByBrowserPage.GRID_CELL % grid_cell_value)
        return element.is_displayed()