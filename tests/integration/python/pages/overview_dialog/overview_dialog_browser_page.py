from framework.pages_base.base_browser_page import BaseBrowserPage

class OverviewDialogBrowserPage(BaseBrowserPage):
    OVERVIEW_DIALOG = '.data-overview-wrapper'
    FILTER_BUTTON = '//button//span[text()="%s"]'
    ACTION_BUTTON = '//button[text()="%s"]'
    SELECT_ALL_CHECKBOX = 'div[col-id="name"] > .ag-header-select-all'
    STATUS_COLUMN = '//div[@class="status-container"]'

    def check_if_overview_dialog_is_opened(self):
        self.focus_on_add_in_popup_frame()

        return self.check_if_element_exists_by_css(OverviewDialogBrowserPage.OVERVIEW_DIALOG)
    
    def is_action_button_visible(self, button_text):
        self.focus_on_add_in_popup_frame()
        selector = OverviewDialogBrowserPage.ACTION_BUTTON

        if button_text == 'Filter':
            selector = OverviewDialogBrowserPage.FILTER_BUTTON

        element = self.get_element_by_xpath(selector % button_text)

        return element.is_displayed()

    def is_action_button_enabled(self, button_text):
        self.focus_on_add_in_popup_frame()
        selector = OverviewDialogBrowserPage.ACTION_BUTTON

        if button_text == 'Filter':
            selector = OverviewDialogBrowserPage.FILTER_BUTTON
        
        element = self.get_element_by_xpath(selector % button_text)

        return element.is_enabled_by_attribute_html()
    
    def click_select_all_checkbox(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(OverviewDialogBrowserPage.SELECT_ALL_CHECKBOX).click()

    def click_action_button(self, button_text):
        self.focus_on_add_in_popup_frame()

        selector = OverviewDialogBrowserPage.ACTION_BUTTON

        if button_text == 'Filter':
            selector = OverviewDialogBrowserPage.FILTER_BUTTON

        self.get_element_by_xpath(selector % button_text).click()

    def wait_for_all_objects_to_refresh_successfully(self):
        self.focus_on_add_in_popup_frame()

        all_elements = self.get_elements_by_xpath(OverviewDialogBrowserPage.STATUS_COLUMN)

        for index in range(len(all_elements)):
            selector = '//div[@row-id="%s"]/div[@aria-colindex="8"]//span[text()="Refresh successful"]' % index
            self.get_element_by_xpath(selector)
    
    