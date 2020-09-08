import json

from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.const import DEFAULT_WAIT_BETWEEN_CHECKS


class ColumnsAndFiltersSelectionMacDesktopPage(BaseMacDesktopPage):
    ITEM_ALL_ATTRIBUTES = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[5]/AXGroup[0]"
    ITEM_ALL_METRICS = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[7]/AXGroup[0]"

    ATTRIBUTE_CHECKBOX_UNCHECKED = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXOutline[0]/AXRow[@AXDescription='%s']"
    ATTRIBUTE_CHECKBOX_CHECKED = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXOutline[0]/AXRow[@AXDescription=" \
                                                                         "'icon: caret-down %s']"
    METRIC_CHECKBOX = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXTable[0]/AXUnknown[0]/" \
                                                              "AXGroup/AXGroup[@AXDescription='%s']"

    IMPORT_BUTTON = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[13]/AXButton[@AXTitle='Import']"

    ATTRIBUTE_FORM_DROPDOWN = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[3]/AXComboBox/AXGroup[0]/AXGroup[0]"
    ATTRIBUTE_FORM_DROPDOWN_GROUPS = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[%s]"
    ATTRIBUTE_FORM_DROPDOWN_SUFFIX = "/AXList[0]/AXStaticText[@AXTitle='%s']"

    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[2]/AXStaticText" \
                                                                                      "[@AXValue=" \
                                                                                      "'Columns & Filters Selection']"

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
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionMacDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT)

    def click_attribute(self, attribute_name):
        unchecked_attribute_checkbox = ColumnsAndFiltersSelectionMacDesktopPage \
                                           .ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_name

        if self.check_if_element_exists_by_xpath(unchecked_attribute_checkbox, timeout=DEFAULT_WAIT_BETWEEN_CHECKS):
            self.get_element_by_xpath(unchecked_attribute_checkbox).click()
        else:
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_CHECKED % attribute_name
            ).click()

    def click_metric(self, metric_name):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.METRIC_CHECKBOX % metric_name).click()

    def select_display_attributes_form_names_element(self, visualization_type):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN).click()

        groups_no = self.get_elements_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_GROUPS)

        selector_suffix = ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_SUFFIX % visualization_type

        self.get_element_by_xpath_workaround(
            ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_GROUPS + selector_suffix,
            expected_list_len=len(groups_no)
        ).click()

    def click_import_button(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.IMPORT_BUTTON).click()

    def click_import_button_to_duplicate(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.IMPORT_BUTTON).click()

    def click_attributes_and_forms(self, attributes_and_forms_json):
        for attribute_name, attribute_forms in json.loads(attributes_and_forms_json).items():
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_name
            ).click()

            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_CHECKED % attribute_name
            ).click(
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_TOGGLER_OFFSET_X,
                ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_FORM_TOGGLER_OFFSET_Y
            )

            for attribute_form in attribute_forms:
                self.get_element_by_xpath(
                    ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_form
                ).click()
