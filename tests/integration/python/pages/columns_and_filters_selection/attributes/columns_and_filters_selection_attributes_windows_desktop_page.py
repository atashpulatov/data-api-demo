import json
import time

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionAttributesWindowsDesktopPage(BaseWindowsDesktopPage):
    ITEM_ALL_ATTRIBUTES = '(All)'

    ATTRIBUTE_ELEM = '//Text[@Name="%s"]'
    ATTRIBUTE_ELEM_AT = '//Group/Tree/TreeItem[%s]'

    ATTRIBUTE_FORM_DROPDOWN_ELEM = '//TreeItem[@Name="%s"]/Text[@Name="icon: caret-down"]'
    ATTRIBUTE_FORM_DROPDOWN_ELEM_AT = '//TreeItem[%s]/Text[@Name="icon: caret-down"]'
    ATTRIBUTE_FORM_ELEMENT_AT = '/Group/TreeItem[%s]/Group/Text'
    ATTRIBUTE_FORM_ITEM_ELEM = '//Group[@Name="%s"]'

    ATTRIBUTES_CONTAINER = '//Group/Tree'

    CLICKS_TO_SCROLL = 4

    def click_attribute(self, attribute_name):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM % attribute_name
        ).click()

    def click_attribute_for_dataset(self, attribute_name):
        self.click_attribute(attribute_name)

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

    def ensure_attribute_is_selected_and_click_forms(self, attributes_and_forms_json):
        attributes_and_forms = json.loads(attributes_and_forms_json)

        for attribute_name, form_names in attributes_and_forms.items():
            if len(form_names) > 0:
                self._select_forms_of_attribute(attribute_name, form_names)

    def _select_forms_of_attribute(self, attribute_name, form_names):
        self._ensure_attribute_is_selected(attribute_name)

        self._open_attribute_forms_list(attribute_name)

        self._select_attribute_forms_for_selected_attribute(form_names)

    def _ensure_attribute_is_selected(self, attribute_name):
        if not self.get_add_in_main_element().check_if_element_exists_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_FORM_DROPDOWN_ELEM % attribute_name,
            timeout=Const.MEDIUM_TIMEOUT
        ):
            self.get_add_in_main_element().get_element_by_xpath(
                ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM % attribute_name
            ).click()

    def _open_attribute_forms_list(self, attribute_name):
        self.get_add_in_main_element().get_element_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_FORM_DROPDOWN_ELEM % attribute_name
        ).click()

    # TODO ensure it selects forms of the correct attribute
    def _select_attribute_forms_for_selected_attribute(self, form_names):
        for form_name in form_names:
            self.get_add_in_main_element().get_element_by_xpath(
                ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_FORM_ITEM_ELEM % form_name
            ).click()

    def select_attribute_by_number(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        self._find_attribute_by_number(object_number).move_to_and_click()

        popup_main_element.move_to()  # Needed when selecting many attributes consecutively.

    def expand_attribute_form(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_FORM_DROPDOWN_ELEM_AT % object_number
        ).click()

    def collapse_attribute_form(self, object_number):
        self.expand_attribute_form(object_number)

    def get_attribute_form_name(self, attribute_form_number, attribute_number):
        popup_main_element = self.get_add_in_main_element()

        attribute_form_element = popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM_AT % attribute_number +
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_FORM_ELEMENT_AT % attribute_form_number
        )

        return attribute_form_element.text

    def get_attribute_name(self, object_number):
        return self._find_attribute_by_number(object_number).get_name_by_attribute()

    def scroll_into_and_select_attribute_by_number(self, object_number):
        """
        Scrolls into attribute number object_number using a workaround for the defect in WinAppDriver's moveto command,
        which does not scroll to non-visible element.

        After selecting the element, we scroll back to the top by pressing the HOME key. It's done to ensure scrolling
        always starts at the top. It would be ideal to ensure this before starting to scroll, but not feasible as we
        don't have focus before selecting an element.

        :param object_number: Number of object to scroll to.
        """
        popup_main_element = self.get_add_in_main_element()

        attribute_element = self._find_attribute_by_number(object_number)

        attributes_container = popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTES_CONTAINER
        )

        end_time = time.time() + Const.LONG_TIMEOUT
        while attribute_element.is_offscreen_by_attribute():
            if time.time() > end_time:
                raise MstrException(f'Timeout while scrolling to attribute number {object_number} called '
                                    f'{attribute_element.text}, element is still not visible on screen.')

            self._scroll_attributes_down(attributes_container)
            attribute_element = self._find_attribute_by_number(object_number)

        self._scroll_attributes_down(attributes_container)
        attribute_element.move_to_and_click()

        self.press_home()

    def _find_attribute_by_number(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        return popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.ATTRIBUTE_ELEM_AT % object_number
        )

    def _scroll_attributes_down(self, attributes_container):
        for i in range(ColumnsAndFiltersSelectionAttributesWindowsDesktopPage.CLICKS_TO_SCROLL):
            attributes_container_size = attributes_container.size
            attributes_container.click(attributes_container_size['width'], attributes_container_size['height'])
