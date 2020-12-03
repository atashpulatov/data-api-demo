import json
import time

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import LONG_TIMEOUT
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionFiltersWindowsDesktopPage(BaseWindowsDesktopPage):
    FILTER_TITLE_ITEM = '//TreeItem[starts-with(@Name, "icon_filter_blue")]/Group[@Name="%s"]/..'
    FILTER_VALUES_BOX = '//DataGrid[@Name="grid"]/Group[contains(@Name, "%s")]'
    FILTER_VALUE_SELECTOR = '//Text[@Name="%s"]'

    FIRST_FILTER = '//Tree[starts-with(@Name, "icon_filter_blue")]/TreeItem[1]'

    MOVE_OUT_OF_FILTER_PARENT_OFFSET_X = 0
    MOVE_OUT_OF_FILTER_PARENT_OFFSET_Y = -100

    SELECT_FILTER_OFFSET_X = 10
    SELECT_FILTER_OFFSET_Y = 10

    ALL_ITEMS = '(All)'

    FILTER_TREE = '(//Group/Tree)[2]'
    FILTER_TREE_ITEM_AT = '(%s/TreeItem/Group/Text)[%%s]' % FILTER_TREE

    CLICKS_TO_SCROLL = 4

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
                parent_element = self.get_add_in_main_element().get_element_by_xpath(
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

    def select_all_filter_elements(self, filter_name):
        self._select_filter(filter_name)

        self.get_elements_by_name(ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.ALL_ITEMS)[-1].click()

    def _select_filter(self, filter_name):
        self.get_add_in_main_element().get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TITLE_ITEM % filter_name
        ).click(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.SELECT_FILTER_OFFSET_X,
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.SELECT_FILTER_OFFSET_Y
        )

    def get_filter_name(self, object_number):
        return self._find_filter_by_number(object_number).get_name_by_attribute()

    def scroll_into_and_select_filter_by_number(self, object_number):
        """
        Scrolls into filter number object_number using a workaround for the defect in WinAppDriver's moveto command,
        which does not scroll to non-visible element.

        After selecting the element, we scroll back to the top by pressing the HOME key. It's done to ensure scrolling
        always starts at the top. It would be ideal to ensure this before starting to scroll, but not feasible as we
        don't have focus before selecting an element.

        :param object_number: Number of object to scroll to.
        """
        filter_element = self._find_filter_by_number(object_number)

        filters_container = self.get_add_in_main_element().get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TREE
        )

        end_time = time.time() + LONG_TIMEOUT
        while filter_element.is_offscreen_by_attribute():
            if time.time() > end_time:
                raise MstrException(f'Timeout while scrolling to filter number {object_number} called '
                                    f'{filter_element.text}, element is still not visible on screen.')

            self._scroll_filters_down(filters_container)
            filter_element = self._find_filter_by_number(object_number)

        self._scroll_filters_down(filters_container)
        filter_element.click()

        self.press_home()

    def _find_filter_by_number(self, object_number):
        return self.get_add_in_main_element().get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TREE_ITEM_AT % object_number
        )

    def _scroll_filters_down(self, filters_container):
        for i in range(ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.CLICKS_TO_SCROLL):
            filters_container_size = filters_container.size
            filters_container.click(filters_container_size['width'], filters_container_size['height'])

    def hover_over_first_filter(self):
        self._get_first_filter().move_to()

    def select_first_filter(self):
        self._get_first_filter().click(10, 10)

    def get_background_color_of_first_filter(self):
        return self._get_first_filter().pick_color(2, 2)

    def _get_first_filter(self):
        return self.get_add_in_main_element().get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FIRST_FILTER
        )
