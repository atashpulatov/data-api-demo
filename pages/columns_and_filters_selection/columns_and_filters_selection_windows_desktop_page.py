import json

from pages.base_windows_desktop_page import BaseWindowsDesktopPage


class ColumnsAndFiltersSelectionWindowsDesktopPage(BaseWindowsDesktopPage):
    ITEM_ALL_METRICS = 'metric(All)'
    ITEM_ALL_ATTRIBUTES = '(All)'

    DROPDOWN_ELEM = '//Button/ComboBox'
    ITEM_ELEM = '//List/ListItem[@Name="%s"]'

    METRIC_ELEM = '//Text[@Name="%s"]'

    ATTRIBUTE_ELEM = '//Text[@Name="%s"]'
    ATTRIBUTE_FORM_DROPDOWN_ELEM = '//TreeItem[@Name="%s"]/Text[@Name="icon: caret-down"]'
    ATTRIBUTE_FORM_ITEM_ELEM = '//Group[@Name="%s"]'

    IMPORT_BUTTON = 'import'

    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'

    def click_attribute(self, attribute_name):
        self._click_list_item(ColumnsAndFiltersSelectionWindowsDesktopPage.ATTRIBUTE_ELEM % attribute_name)

    def click_metric(self, metric_name):
        self._click_list_item(ColumnsAndFiltersSelectionWindowsDesktopPage.METRIC_ELEM % metric_name)

    def _click_list_item(self, selector):
        popup_main_element = self.get_popup_main_element()

        element = self.find_element_by_xpath_from_parent(popup_main_element, selector)

        self.click_element_simple(element)

    def click_display_attributes_names_type(self, form_visualization_type):
        popup_main_element = self.get_popup_main_element()

        dropdown = self.find_element_by_xpath_from_parent(
            popup_main_element,
            ColumnsAndFiltersSelectionWindowsDesktopPage.DROPDOWN_ELEM
        )

        self.click_element_simple(dropdown)

        menu_item = self.find_element_by_xpath_from_parent(
            popup_main_element,
            ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ELEM % form_visualization_type
        )

        self.click_element_simple(menu_item)

    def select_all_attributes(self):
        self.click_element_by_name(ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_ATTRIBUTES,
                                   image_name=self.prepare_image_name('select_all_attributes'))

    def unselect_all_attributes(self):
        self.click_element_by_name(ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_ATTRIBUTES,
                                   image_name=self.prepare_image_name('unselect_all_attributes'))

    def select_all_metrics(self):
        self.click_element_by_name(ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_METRICS,
                                   image_name=self.prepare_image_name('select_all_metrics'))

    def unselect_all_metrics(self):
        self.click_element_by_name(ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_METRICS,
                                   image_name=self.prepare_image_name('unselect_all_metrics'))

    def click_attributes_and_forms(self, attributes_and_forms_json):
        attributes_and_forms = json.loads(attributes_and_forms_json)

        popup_main_element = self.get_popup_main_element()

        for attribute_name, form_names in attributes_and_forms.items():
            attribute = self.find_element_by_xpath_from_parent(
                popup_main_element,
                ColumnsAndFiltersSelectionWindowsDesktopPage.ATTRIBUTE_ELEM % attribute_name
            )
            self.click_element_simple(attribute)

            if len(form_names) > 0:
                form_dropdown = self.find_element_by_xpath_from_parent(
                    popup_main_element,
                    ColumnsAndFiltersSelectionWindowsDesktopPage.ATTRIBUTE_FORM_DROPDOWN_ELEM % attribute_name
                )
                self.click_element_simple(form_dropdown)

                for form_name in form_names:
                    form_item = self.find_element_by_xpath_from_parent(
                        popup_main_element,
                        ColumnsAndFiltersSelectionWindowsDesktopPage.ATTRIBUTE_FORM_ITEM_ELEM % form_name
                    )
                    self.click_element_simple(form_item)

    def click_import_button(self):
        self.click_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON))

    def ensure_columns_and_filters_selection_is_visible(self):
        element_coordinates = self.check_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT,
            image_name=self.prepare_image_name(
                ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT))

        if not element_coordinates:
            raise Exception('Error while opening Attributes Metrics Filters')
