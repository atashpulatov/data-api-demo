import json

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ColumnsAndFiltersSelectionFiltersWindowsDesktopPage(BaseWindowsDesktopPage):
    FILTER_TITLE_ITEM = '//TreeItem[starts-with(@Name,"icon_filter_blue")]/Group[@Name="{0}"]'
    FILTER_VALUE = '//DataGrid[@Name="grid"]/Group[contains(@Name,"{0}")]/Text[@Name="{0}"]'

    def select_filter_elements(self, filters_and_elements_json):
        """
        Select specified filter and filter values on 'Prepare data' window.

        :param filters_and_elements_json: JSON object that specify filter and its values to be selected. (eg. { "Category": ["Books", "Electronics"] })
        """
        filters_and_elements = json.loads(filters_and_elements_json)

        for filter_name, elements_names in filters_and_elements.items():
            self._select_filter(filter_name)

            if len(elements_names) > 0:
                for element_name in elements_names:
                    el = self.get_element_by_xpath(
                        ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_VALUE.format(element_name),
                        image_name=self.prepare_image_name(ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_VALUE.format(element_name))
                    )
                    el.click()
                    el.move_to(offset_x=2, offset_y=-1000) # moving cursor out from element - tooltip can block click on desired element

    def _select_filter(self, filter):
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionFiltersWindowsDesktopPage.FILTER_TITLE_ITEM.format(filter) # no image - it'd be the same like attribute
        ).click()
