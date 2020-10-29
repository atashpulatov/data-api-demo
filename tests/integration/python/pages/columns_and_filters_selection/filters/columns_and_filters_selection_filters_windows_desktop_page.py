import json

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ColumnsAndFiltersSelectionFiltersWindowsDesktopPage(BaseWindowsDesktopPage):
    FILTER_TITLE_ITEM = '//TreeItem[starts-with(@Name,"icon_filter_blue")]/Group[@Name="%s"]/..'
    FILTER_VALUES_BOX = '//DataGrid[@Name="grid"]/Group[contains(@Name,"%s")]'
    FILTER_VALUE_SELECTOR = '//Text[@Name="%s"]'

    MOVE_OUT_OF_FILTER_PARENT_OFFSET_X = 0
    MOVE_OUT_OF_FILTER_PARENT_OFFSET_Y = -100

    FILTER_TREE = '(//Group/Tree)[2]'

    FILTER_TREE_ITEM_AT = f'({FILTER_TREE}/TreeItem/Group/Text)[%s]'

    CLICKS_TO_SCROLL = 5

    def select_filter_elements(self, filters_and_elements_json):
        """
        Selects specified filter and filter values on 'Prepare Data' window.

        :param filters_and_elements_json: JSON object that specify filter and its values to be selected
        (eg. { "Category": ["Books", "Electronics"] }).
        """

        filters_and_elements = json.loads(filters_and_elements_json)

        for filter_name, elements_names in filters_and_elements.items():
            self._select_filter(filter_name)

            if elements_names:
                parent_element = self.get_element_by_xpath(
                    ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_VALUES_BOX % elements_names[0]
                )

                for element_name in elements_names:
                    parent_element.get_element_by_xpath(
                        ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_VALUE_SELECTOR % element_name
                    ).click()

                    # Move cursor out of element - tooltip can block click on desired element.
                    parent_element.move_to(
                        offset_x=ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.MOVE_OUT_OF_FILTER_PARENT_OFFSET_X,
                        offset_y=ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.MOVE_OUT_OF_FILTER_PARENT_OFFSET_Y
                    )

    def _select_filter(self, filter_name):
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TITLE_ITEM % filter_name,
            image_name=self.prepare_image_name(filter_name)
        ).click()

    def _find_filter_by_number(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        return popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TREE_ITEM_AT % object_number)

    def get_filter_name(self, object_number):
        return self._find_filter_by_number(object_number).get_name_by_attribute()

    # Workaround for the defect in WinAppDriver's moveto command, which does not scroll to non-visible element
    def scroll_into_filter_by_number(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        filter_element = self._find_filter_by_number(object_number)

        filters_container = popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TREE)

        while filter_element.get_attribute('IsOffscreen') == 'true':
            for i in range(ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.CLICKS_TO_SCROLL):
                filters_container.click(filters_container.size['width'], filters_container.size['height'])

            filter_element = self._find_filter_by_number(object_number)

        filter_element.move_to()
