import json

from pages.base_browser_page import BaseBrowserPage


class ColumnsAndFiltersSelectionBrowserPage(BaseBrowserPage):
    ATTRIBUTES_CHECKBOX = '.item-title'
    METRIC_ITEM = 'label[aria-label^="%s"]'
    FIRST_CLOSED_ATTRIBUTE_FORM_SWITCHER = 'div:nth-child(1) > div > div.checkbox-list.all-showed > div > div > ' \
                                           'div.attribute-forms > ul > ' \
                                           'li.ant-tree-treenode-switcher-close.ant-tree-treenode-checkbox-checked > ' \
                                           'span.ant-tree-switcher'

    ALL_ATTRIBUTES = '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > ' \
                     'div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > ' \
                     'div.checkbox-list.all-showed > div > div > label.mstr-office-checkbox-all'

    ALL_METRICS = '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > ' \
                  'div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.metrics-col > div > ' \
                  'div.checkbox-list.all-showed > div > div > label'

    ATTRIBUTE_FORM_DROPDOWN = '.ant-select-selection--single'
    ATTRIBUTE_FORM_DROP_DOWN_ITEM = '.ant-select-dropdown-menu-item'

    IMPORT_BUTTON_ELEM = 'import'

    def click_attribute(self, attribute_name):
        self.focus_on_import_data_pop_up_frame()

        attribute = self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTES_CHECKBOX,
            attribute_name)
        self.click_element_with_offset(attribute, xoffset=-20, yoffset=0)

    def click_metric(self, metric_name):
        self.focus_on_import_data_pop_up_frame()

        self.click_element_by_css(ColumnsAndFiltersSelectionBrowserPage.METRIC_ITEM % metric_name)

    def click_display_attributes_names_type(self, form_visualization_type):
        self.focus_on_import_data_pop_up_frame()

        self.click_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROPDOWN)

        self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM, form_visualization_type)

    def unselect_all_attributes(self):
        self.focus_on_import_data_pop_up_frame()

        self.click_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_ATTRIBUTES)

    def select_all_metrics(self):
        self.focus_on_import_data_pop_up_frame()

        self.click_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_METRICS)

    def unselect_all_metrics(self):
        self.focus_on_import_data_pop_up_frame()

        self.click_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_METRICS)

    def click_attributes_and_forms(self, attributes_and_forms_json):
        self.focus_on_import_data_pop_up_frame()

        attributes_and_forms = json.loads(attributes_and_forms_json)

        for attribute_name, form_names in attributes_and_forms.items():
            attribute = self.find_element_by_text_in_elements_list_by_css(
                ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTES_CHECKBOX, attribute_name)
            self.click_element_simple(attribute)

            if len(form_names) > 0:
                self.click_element_by_css(ColumnsAndFiltersSelectionBrowserPage.FIRST_CLOSED_ATTRIBUTE_FORM_SWITCHER)

                for form_name in form_names:
                    form = self.find_element_by_text_in_elements_list_by_css(
                        ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTES_CHECKBOX, form_name)
                    self.click_element_with_offset(form, xoffset=-20, yoffset=0)

    def click_import_button(self):
        self.click_element_by_id(ColumnsAndFiltersSelectionBrowserPage.IMPORT_BUTTON_ELEM)
