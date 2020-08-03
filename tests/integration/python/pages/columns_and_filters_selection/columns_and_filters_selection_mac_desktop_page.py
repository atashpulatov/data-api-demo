from pages_base.base_mac_desktop_page import BaseMacDesktopPage
from selenium.common.exceptions import TimeoutException
import json


class ColumnsAndFiltersSelectionMacDesktopPage(BaseMacDesktopPage):
    ITEM_ALL_ATTRIBUTES = "%s/AXGroup[5]/AXGroup[0]" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ITEM_ALL_METRICS = "%s/AXGroup[7]/AXGroup[0]" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ATTRIBUTE_CHECKBOX_UNCHECKED = "%s/AXOutline[0]/AXRow[@AXDescription='%%s']" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ATTRIBUTE_CHECKBOX_CHECKED = "%s/AXOutline[0]/AXRow[@AXDescription='icon: caret-down %%s']" \
                                 % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    METRIC_CHECKBOX = "%s/AXTable[0]/AXUnknown[0]/AXGroup/" \
                      "AXGroup[@AXDescription='%%s']" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    IMPORT_BUTTON = "%s/AXGroup[13]/AXButton[@AXTitle='Import']" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ATTRIBUTE_FORM_DROPDOWN = "%s/AXGroup[3]/AXComboBox/AXGroup[0]" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ATTRIBUTE_FORM_DROP_DOWN_ITEM = "%s/AXList[0]/AXStaticText[@AXTitle='%%s']" \
                                    % BaseMacDesktopPage.DISPLAY_ATTRIBUTE_FORM_ELEM
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = "%s/AXGroup[2]/AXStaticText[@AXValue='Columns & Filters Selection']" \
                                              % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ATTRIBUTE_FORM_TOGGLER_OFFSET_X = 7
    ATTRIBUTE_FORM_TOGGLER_OFFSET_Y = 16

    def __init__(self):
        super().__init__()

    def unselect_all_attributes(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ITEM_ALL_ATTRIBUTES).click()

    def select_all_attributes(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ITEM_ALL_ATTRIBUTES).click()

    def unselect_all_metrics(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ITEM_ALL_METRICS).click()

    def select_all_metrics(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ITEM_ALL_METRICS).click()

    def ensure_columns_and_filters_selection_is_visible(self):
        columns_and_filters_selection_element = self.get_element_by_xpath(
            ColumnsAndFiltersSelectionMacDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT)

    def click_attribute(self, attribute_name):
        try:
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_name).click()
        except TimeoutException:
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_CHECKED % attribute_name).click()

    def click_metric(self, metric_name):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.METRIC_CHECKBOX % metric_name).click()

    def click_display_attributes_names_type(self, form_visualization_type):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN).click()
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM % form_visualization_type).click()

    def click_import_button(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.IMPORT_BUTTON).click()

    def click_attributes_and_forms(self, attributes_and_forms_json):
        for attribute_name, attribute_forms in json.loads(attributes_and_forms_json).items():
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_name).click()
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_CHECKED % attribute_name).click(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_TOGGLER_OFFSET_X,
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_TOGGLER_OFFSET_Y)
            for attribute_form in attribute_forms:
                self.get_element_by_xpath(
                    ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_form).click()
