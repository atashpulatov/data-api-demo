import json

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ColumnsAndFiltersSelectionAttributesWindowsDesktopPage(BaseWindowsDesktopPage):
    ITEM_ALL_ATTRIBUTES = '(All)'

    ATTRIBUTE_ELEM = '//Text[@Name="%s"]'
    ATTRIBUTE_FORM_DROPDOWN_ELEM = '//TreeItem[@Name="%s"]/Text[@Name="icon: caret-down"]'
    ATTRIBUTE_FORM_ITEM_ELEM = '//Group[@Name="%s"]'

    ATTRIBUTE_ELEM_XPATH = '//Group/Tree/TreeItem'

    def click_attribute(self, attribute_name):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM % attribute_name
        ).click()

    def select_all_attributes(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ITEM_ALL_ATTRIBUTES,
            image_name=self.prepare_image_name('select_all_attributes')
        ).click()

    def unselect_all_attributes(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ITEM_ALL_ATTRIBUTES,
            image_name=self.prepare_image_name('unselect_all_attributes')
        ).click()

    # TODO change implementation to ensure attribute is selected (not only clicking without checking)
    def ensure_attribute_is_selected_and_click_forms(self, attributes_and_forms_json):
        attributes_and_forms = json.loads(attributes_and_forms_json)

        popup_main_element = self.get_add_in_main_element()

        for attribute_name, form_names in attributes_and_forms.items():
            popup_main_element.get_element_by_xpath(
                ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM % attribute_name
            ).click()

            if len(form_names) > 0:
                popup_main_element.get_element_by_xpath(
                    ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_FORM_DROPDOWN_ELEM % attribute_name
                ).click()

                for form_name in form_names:
                    popup_main_element.get_element_by_xpath(
                        ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_FORM_ITEM_ELEM % form_name
                    ).click()

    def select_attribute_by_number(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            f"{ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM_XPATH}[{object_number}]"
        ).move_to_and_click()

    def get_attribute_name(self, object_number):
        popup_main_element = self.get_add_in_main_element()
        attribute_elements = popup_main_element.get_elements_by_xpath(ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM_XPATH)
        
        return attribute_elements[int(object_number) - 1].get_name_by_attribute()
