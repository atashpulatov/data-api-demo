import json

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionAttributesBrowserPage(BaseBrowserPage):
    ATTRIBUTES_CHECKBOX = '.item-title'
    ATTRIBUTES_IN_DATASET_CHECKBOX = '.ant-checkbox-wrapper'

    ALL_ATTRIBUTES = '.attributes-col .mstr-office-checkbox-all'

    PARENT_ATTRIBUTE_ELEMENTS = '.attribute-forms li'
    CHILD_ATTRIBUTE_ELEMENT = 'span > span > .item-title'
    ATTRIBUTE_FORMS = 'ul li[role="treeitem"] .item-title'
    ATTRIBUTE_FORM_ARROW_COLLAPSED = '.ant-tree-switcher_close'
    ATTRIBUTE_FORM_ARROW_EXPANDED = '.ant-tree-switcher_open'

    ROOT_ATTRIBUTE_CONTAINER = '.attributes-col'

    # TODO might not work for datasets
    ATTRIBUTES_CONTAINER = ROOT_ATTRIBUTE_CONTAINER + ' > div > .checkbox-list.all-showed > div > div > div > ul'
    ATTRIBUTE_ELEMENT_AT = ATTRIBUTES_CONTAINER + ' > li:nth-child(%s)'

    ATTRIBUTE_FORM_ARROW_COLLAPSED_ELEMENT_AT = (
            ATTRIBUTE_ELEMENT_AT + ' > span.ant-tree-switcher' + ATTRIBUTE_FORM_ARROW_COLLAPSED
    )
    ATTRIBUTE_FORM_ARROW_EXPANDED_ELEMENT_AT = (
            ATTRIBUTE_ELEMENT_AT + ' > span.ant-tree-switcher' + ATTRIBUTE_FORM_ARROW_EXPANDED
    )
    ATTRIBUTE_FORM_ELEMENT_CONTAINER = ' > ul > li:nth-child(%s)'

    COLLAPSE_ATTRIBUTE_FORMS = 'collapse'

    CHECKED_CHECKBOX_CLASS = '.ant-tree-checkbox.ant-tree-checkbox-checked'

    def click_attribute(self, attribute_name):
        attribute = self._get_attribute_checkbox(
            attribute_name,
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTES_CHECKBOX
        )
        attribute.click(offset_x=10, offset_y=5)

    def click_attribute_for_dataset(self, attribute_name):
        attribute = self._get_attribute_checkbox(
            attribute_name,
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTES_IN_DATASET_CHECKBOX
        )
        attribute.click(offset_x=10, offset_y=5)

    def _get_attribute_checkbox(self, attribute_name, attribute_selector):
        self.focus_on_add_in_popup_frame()

        return self.find_element_by_text_in_elements_list_by_css(
            attribute_selector,
            attribute_name
        )

    def select_all_attributes(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionAttributesBrowserPage.ALL_ATTRIBUTES).click()

    def unselect_all_attributes(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionAttributesBrowserPage.ALL_ATTRIBUTES).click()

    def ensure_attribute_is_selected_and_click_forms(self, attributes_and_forms_json):
        self.focus_on_add_in_popup_frame()

        attributes_and_forms = json.loads(attributes_and_forms_json)

        for attribute_name, form_names in attributes_and_forms.items():
            attribute_element = self._get_attribute_element(attribute_name)

            self._ensure_attribute_is_selected(attribute_element)

            self._click_forms(attribute_element, form_names)

    def _get_attribute_element(self, attribute_name):
        return self.get_parent_element_by_child_text_from_parent_elements_list_by_css(
            ColumnsAndFiltersSelectionAttributesBrowserPage.PARENT_ATTRIBUTE_ELEMENTS,
            ColumnsAndFiltersSelectionAttributesBrowserPage.CHILD_ATTRIBUTE_ELEMENT,
            attribute_name
        )

    def _ensure_attribute_is_selected(self, attribute_element):
        if not attribute_element.check_if_element_exists_by_css(
                ColumnsAndFiltersSelectionAttributesBrowserPage.CHECKED_CHECKBOX_CLASS,
                timeout=SHORT_TIMEOUT):
            attribute_element.click()

    def _click_forms(self, attribute_element, form_names):
        if len(form_names) > 0:
            self._ensure_attributes_forms_are_expanded(attribute_element)

            for form_name in form_names:
                attribute_form_element = attribute_element.get_element_by_text_from_elements_list_by_css(
                    ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_FORMS,
                    form_name
                )

                attribute_form_element.move_to_and_click(offset_x=2, offset_y=2)

    def _ensure_attributes_forms_are_expanded(self, attribute_element):
        if attribute_element.check_if_element_exists_by_css(
                ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_FORM_ARROW_COLLAPSED,
                timeout=SHORT_TIMEOUT):
            attribute_element.get_element_by_css(
                ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_FORM_ARROW_COLLAPSED
            ).click()

        if not attribute_element.check_if_element_exists_by_css(
                ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_FORM_ARROW_EXPANDED,
                timeout=SHORT_TIMEOUT):
            raise MstrException('Error while expanding attributes forms.')

    def select_attribute_by_number(self, object_number):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_ELEMENT_AT % object_number
        ).click()

    def expand_attribute_form(self, object_number):
        self.focus_on_add_in_popup_frame()

        attribute_form_arrow = self.get_element_by_css(
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_FORM_ARROW_COLLAPSED_ELEMENT_AT % object_number)

        attribute_form_arrow.click()

    def collapse_attribute_form(self, object_number):
        self.focus_on_add_in_popup_frame()

        attribute_form_arrow = self.get_element_by_css(
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_FORM_ARROW_EXPANDED_ELEMENT_AT % object_number)

        attribute_form_arrow.click()

    def get_attribute_form_name(self, attribute_form_number, attribute_number):
        self.focus_on_add_in_popup_frame()

        attribute_element_container = \
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_ELEMENT_AT % attribute_number

        attribute_form_element = self.get_element_by_css(
            attribute_element_container +
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_FORM_ELEMENT_CONTAINER % attribute_form_number
        )

        return attribute_form_element.text

    def get_attribute_name(self, object_number):
        self.focus_on_add_in_popup_frame()

        return self.get_element_by_css(
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_ELEMENT_AT % object_number
        ).text

    def scroll_into_and_select_attribute_by_number(self, object_number):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css_no_visibility_checked(
            ColumnsAndFiltersSelectionAttributesBrowserPage.ATTRIBUTE_ELEMENT_AT % object_number
        ).move_to_and_click()
