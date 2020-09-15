import json

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


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

        element = popup_main_element.get_element_by_xpath(selector)

        element.click()

    # TODO use form_visualization_type
    def select_display_attributes_form_names_element(self, form_visualization_type):
        popup_main_element = self.get_popup_main_element()

        popup_main_element.get_element_by_xpath(ColumnsAndFiltersSelectionWindowsDesktopPage.DROPDOWN_ELEM).click()

    def select_all_attributes(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_ATTRIBUTES,
            image_name=self.prepare_image_name('select_all_attributes')
        ).click()

    def unselect_all_attributes(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_ATTRIBUTES,
            image_name=self.prepare_image_name('unselect_all_attributes')
        ).click()

    def select_all_metrics(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_METRICS,
            image_name=self.prepare_image_name('select_all_metrics')
        ).click()

    def unselect_all_metrics(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.ITEM_ALL_METRICS,
            image_name=self.prepare_image_name('unselect_all_metrics')
        ).click()

    # TODO change implementation to ensure attribute is selected (not only clicking without checking)
    def ensure_attribute_is_selected_and_click_forms(self, attributes_and_forms_json):
        attributes_and_forms = json.loads(attributes_and_forms_json)

        popup_main_element = self.get_popup_main_element()

        for attribute_name, form_names in attributes_and_forms.items():
            popup_main_element.get_element_by_xpath(
                ColumnsAndFiltersSelectionWindowsDesktopPage.ATTRIBUTE_ELEM % attribute_name
            ).click()

            if len(form_names) > 0:
                popup_main_element.get_element_by_xpath(
                    ColumnsAndFiltersSelectionWindowsDesktopPage.ATTRIBUTE_FORM_DROPDOWN_ELEM % attribute_name
                ).click()

                for form_name in form_names:
                    popup_main_element.get_element_by_xpath(
                        ColumnsAndFiltersSelectionWindowsDesktopPage.ATTRIBUTE_FORM_ITEM_ELEM % form_name
                    ).click()

    def click_import_button(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON)
        ).click()

    def click_import_button_to_duplicate(self):
        self.get_element_by_accessibility_id(
            ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ColumnsAndFiltersSelectionWindowsDesktopPage.IMPORT_BUTTON)
        ).click()

    def ensure_columns_and_filters_selection_is_visible(self):
        element_coordinates = self.get_element_center_coordinates_by_name(
            ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT,
            image_name=self.prepare_image_name(
                ColumnsAndFiltersSelectionWindowsDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT)
        )

        if not element_coordinates:
            raise MstrException('Error while opening Attributes Metrics Filters')
