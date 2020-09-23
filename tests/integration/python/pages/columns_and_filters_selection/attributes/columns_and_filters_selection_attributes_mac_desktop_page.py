import json

from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.const import DEFAULT_WAIT_BETWEEN_CHECKS


class ColumnsAndFiltersSelectionAttributesMacDesktopPage(BaseMacDesktopPage):
    ITEM_ALL_ATTRIBUTES = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[5]/AXGroup[0]"

    ATTRIBUTE_CHECKBOX_UNCHECKED = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXOutline[0]/AXRow[@AXDescription='%s']"
    ATTRIBUTE_CHECKBOX_CHECKED = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXOutline[0]/AXRow[@AXDescription=" \
                                                                         "'icon: caret-down %s']"

    ATTRIBUTE_FORM_DROPDOWN = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[3]/AXComboBox/AXGroup[0]/AXGroup[0]"
    ATTRIBUTE_FORM_DROPDOWN_GROUPS = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[%s]"
    ATTRIBUTE_FORM_DROPDOWN_SUFFIX = "/AXList[0]/AXStaticText[@AXTitle='%s']"

    ATTRIBUTE_FORM_TOGGLER_OFFSET_X = 7
    ATTRIBUTE_FORM_TOGGLER_OFFSET_Y = 16

    def unselect_all_attributes(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionAttributesMacDesktopPage.ITEM_ALL_ATTRIBUTES).click()

    def select_all_attributes(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionAttributesMacDesktopPage.ITEM_ALL_ATTRIBUTES).click()

    def click_attribute(self, attribute_name):
        unchecked_attribute_checkbox = ColumnsAndFiltersSelectionAttributesMacDesktopPage \
                                           .ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_name

        if self.check_if_element_exists_by_xpath(unchecked_attribute_checkbox, timeout=DEFAULT_WAIT_BETWEEN_CHECKS):
            self.get_element_by_xpath(unchecked_attribute_checkbox).click()
        else:
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_CHECKBOX_CHECKED % attribute_name
            ).click()

    def select_display_attributes_form_names_element(self, visualization_type):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN).click()

        groups_no = self.get_elements_by_xpath(
            ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_GROUPS
        )

        selector_suffix = \
            ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_SUFFIX % visualization_type

        self.get_element_by_xpath_workaround(
            ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_GROUPS + selector_suffix,
            expected_list_len=len(groups_no)
        ).click()

    # TODO change implementation to ensure attribute is selected (not only clicking without checking)
    def ensure_attribute_is_selected_and_click_forms(self, attributes_and_forms_json):
        for attribute_name, attribute_forms in json.loads(attributes_and_forms_json).items():
            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_name
            ).click()

            self.get_element_by_xpath(
                ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_CHECKBOX_CHECKED % attribute_name
            ).click(
                ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_FORM_TOGGLER_OFFSET_X,
                ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_FORM_TOGGLER_OFFSET_Y
            )

            for attribute_form in attribute_forms:
                self.get_element_by_xpath(
                    ColumnsAndFiltersSelectionAttributesMacDesktopPage.ATTRIBUTE_CHECKBOX_UNCHECKED % attribute_form
                ).click()
