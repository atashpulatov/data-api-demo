import json

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ColumnsAndFiltersSelectionFiltersWindowsDesktopPage(BaseWindowsDesktopPage):
    FILTER_TITLE_ITEM = '//TreeItem[starts-with(@Name,"icon_filter_blue")]/Group[@Name="{}"]/..'
    FILTER_VALUES_BOX = '//DataGrid[@Name="grid"]/Group[contains(@Name,"{}")]'
    FILTER_VALUE_SELECTOR = '//Text[@Name="{}"]'

    def select_filter_elements(self, filters_and_elements_json):
        """
        Select specified filter and filter values on 'Prepare data' window.

        :param filters_and_elements_json: JSON object that specify filter and
        its values to be selected. (eg. { "Category": ["Books", "Electronics"] })
        """
        filters_and_elements = json.loads(filters_and_elements_json)

        for filter_name, elements_names in filters_and_elements.items():
            self._select_filter(filter_name)
            parentEl = self.get_element_by_xpath(
                ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_VALUES_BOX.format(
                    elements_names[0])
            )

            if len(elements_names) > 0:
                for element_name in elements_names:
                    el = parentEl.get_element_by_xpath(
                        ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_VALUE_SELECTOR.format(
                            element_name)
                    )
                    el.click()
                    # moving cursor out from element - tooltip can block click on desired element
                    el.move_to(offset_x=2, offset_y=-1000)

    def _select_filter(self, filter):
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TITLE_ITEM.format(
                filter),
            image_name=self.prepare_image_name(
                ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TITLE_ITEM.format(
                    filter))
        ).click()
