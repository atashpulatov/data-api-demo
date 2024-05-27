from framework.pages_base.base_browser_page import BaseBrowserPage
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.by import By

class OverviewDialogBrowserPage(BaseBrowserPage):
    OVERVIEW_DIALOG = '.data-overview-wrapper'
    FILTER_BUTTON = '//button//span[text()="%s"]'
    ACTION_BUTTON = '//span[text()="%s"]'
    ADD_DATA = '//button[text()="%s"]'
    CLOSE_BUTTON = '//button[text()="%s"]'
    SELECT_ALL_CHECKBOX = 'div[col-id="name"] > .ag-header-select-all'
    STATUS_COLUMN = '//div[@class="status-container"]'
    BUTTONS_SELECTOR = {
        "Add Data": ADD_DATA,
        "Refresh": ACTION_BUTTON,
        "Re-Prompt": ACTION_BUTTON,
        "Duplicate": ACTION_BUTTON,
        "Delete": ACTION_BUTTON,
        "Filter": FILTER_BUTTON,
        "Close": CLOSE_BUTTON
    }
    ROW_CHECKBOX = '//div[@row-index="%s"]//div[@col-id="name"]//div[@class="ag-selection-checkbox"]'
    RANGE_OK_BUTTON = '//button[@aria-label="OK"]'
    SEARCH_FIELD_INPUT = '//input[@class="search-field__input"]'
    CLEAR_SEARCH_BOX = '//button[@aria-label="Clear search field"]'
    OBJECT_ROW = '//span[contains(text(), "%s")]'
    NEW_SHEET_ELEMENT_ID = 'new_sheet'
    DELETE_POPUP = '//dialog//div[contains(text(),"Delete")]'
    DELETE_POPUP_BUTTON = '//dialog//button[text()="Delete"]'
    FILTER_PANEL = '//div[@id="filter-panel"]'
    FILTER_PANEL_OPTION = '//div[@id="filter-panel"]//button[text()="%s"]'
    FILTER_PANEL_NESTED_OPTION = '//dialog[@class="mstr-rc-3-filter-panel__details-pane"]//span[@title="%s"]'
    FILTER_PANEL_APPLY_BUTTON = '//div[@class="mstr-rc-3-filter-panel__footer"]//button[text()="Apply"]'
    FILTER_DETAILS = '//span[text()="Filtered By:"]'
    FILTER_DETAILS_BUTTON = '//button[text()="%s"]'
    OBJECT_ROW_NULL_STATUS = '//div[@class="ag-status-bar-left"]//div[@class="ag-status-name-value ag-status-panel ag-status-panel-total-and-filtered-row-count"]//span[text()="0"]'
    IMPORT_DUPLICATE_POPUP = '//div[@class="base-popup"]//button[text()="Import"]'
    GRID_ROW = "//div[contains(@class, 'ag-row-level-0')]"
    BUTTON = "//button[text()='%s']"

    def check_if_overview_dialog_is_opened(self):
        self.focus_on_add_in_popup_frame()

        return self.check_if_element_exists_by_css(OverviewDialogBrowserPage.OVERVIEW_DIALOG)

    def is_action_button_visible(self, button_text):
        self.focus_on_add_in_popup_frame()
        selector = OverviewDialogBrowserPage.BUTTONS_SELECTOR[button_text]
        element = self.get_element_by_xpath(selector % button_text)

        return element.is_displayed()

    def is_action_button_enabled(self, button_text):
        self.focus_on_add_in_popup_frame()
        selector = OverviewDialogBrowserPage.BUTTONS_SELECTOR[button_text]
        element = self.get_element_by_xpath(selector % button_text)

        return element.is_enabled_by_attribute_html()

    def click_select_all_checkbox(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(OverviewDialogBrowserPage.SELECT_ALL_CHECKBOX).click()

    def click_action_button(self, button_text):
        self.focus_on_add_in_popup_frame()

        selector = OverviewDialogBrowserPage.BUTTONS_SELECTOR[button_text]

        self.get_element_by_xpath(selector % button_text).click()

    def click_import_button_in_duplicate_popup(self):
        self.focus_on_add_in_popup_frame()

        duplicate_popup_option = OverviewDialogBrowserPage.IMPORT_DUPLICATE_POPUP
        self.get_element_by_xpath(duplicate_popup_option).click() 

    def wait_for_all_objects_to_refresh_successfully(self):
        self.focus_on_add_in_popup_frame()

        all_elements = self.get_elements_by_xpath(OverviewDialogBrowserPage.STATUS_COLUMN)

        for index in range(len(all_elements)):
            selector = '//div[@row-id="%s"]/div[@aria-colindex="10"]//span[text()="Refresh successful"]' % index
            self.get_element_by_xpath(selector)

    def click_row_checkbox(self, row_index):
        self.focus_on_add_in_popup_frame()

        row_xpath = OverviewDialogBrowserPage.ROW_CHECKBOX % (int(row_index) - 1)
        self.get_element_by_xpath(row_xpath).click()

    def click_ok_in_range_taken_popup(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_xpath(OverviewDialogBrowserPage.RANGE_OK_BUTTON).click()

    def search_object(self, object_name):
        self.focus_on_add_in_popup_frame()
        search_box = self.get_element_by_xpath(OverviewDialogBrowserPage.SEARCH_FIELD_INPUT)
        search_box.send_keys_with_check(object_name)
        search_box.send_keys(Keys.ENTER)

    def clear_search_input(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_xpath(OverviewDialogBrowserPage.CLEAR_SEARCH_BOX).click()

    def is_object_row_visible(self, object_name):
        self.focus_on_add_in_popup_frame()

        try:
            object_row = WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, OverviewDialogBrowserPage.OBJECT_ROW % object_name)))
            return object_row.is_displayed()
        except NoSuchElementException:
            return False
        except TimeoutException:
            return False

    def is_new_sheet_selected(self):
        self.focus_on_add_in_popup_frame()

        element = self.get_element_by_id(OverviewDialogBrowserPage.NEW_SHEET_ELEMENT_ID)

        return element.is_checked_by_attribute()

    def is_delete_popup_visible(self):
        self.focus_on_add_in_popup_frame()

        element = self.get_element_by_xpath(OverviewDialogBrowserPage.DELETE_POPUP)

        return element.is_displayed()

    def click_delete_in_delete_popup(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_xpath(OverviewDialogBrowserPage.DELETE_POPUP_BUTTON).click()

    def is_filter_panel_visible(self):
        self.focus_on_add_in_popup_frame()

        element = self.get_element_by_xpath(OverviewDialogBrowserPage.FILTER_PANEL)

        return element.is_displayed()

    def click_filter_option_in_filter_panel(self, filter_option):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_xpath(OverviewDialogBrowserPage.FILTER_PANEL_OPTION % filter_option).click()

    def click_filter_checkbox_in_filter_panel(self, filter_checkbox):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_xpath(OverviewDialogBrowserPage.FILTER_PANEL_NESTED_OPTION % filter_checkbox).click()

    def click_apply_in_filter_panel(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_xpath(OverviewDialogBrowserPage.FILTER_PANEL_APPLY_BUTTON).click()

    def is_filter_details_visible(self):
        self.focus_on_add_in_popup_frame()
        try:
            element = self.get_element_by_xpath(OverviewDialogBrowserPage.FILTER_DETAILS)
            return element.is_displayed()
        except NoSuchElementException:
            return False
        
    def is_not_filter_details_visible(self):
        self.focus_on_add_in_popup_frame()
        try:
            element = self.get_element_by_xpath(OverviewDialogBrowserPage.FILTER_DETAILS)
            return not element.is_displayed()
        except NoSuchElementException:
            return True

    def click_filter_details_button(self, filter_details_button):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_xpath(OverviewDialogBrowserPage.FILTER_DETAILS_BUTTON % filter_details_button).click()

    def are_all_objects_are_removed(self):
        self.focus_on_add_in_popup_frame()
        element = self.get_element_by_xpath(OverviewDialogBrowserPage.OBJECT_ROW_NULL_STATUS)

        return element.is_displayed()

    def get_number_of_objects_in_grid(self):
        number_of_grid_rows = len(self.get_elements_by_xpath(OverviewDialogBrowserPage.GRID_ROW))
        return number_of_grid_rows
    