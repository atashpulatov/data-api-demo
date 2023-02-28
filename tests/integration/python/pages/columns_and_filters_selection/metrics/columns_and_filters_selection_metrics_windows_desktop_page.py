import time

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException


class ColumnsAndFiltersSelectionMetricsWindowsDesktopPage(BaseWindowsDesktopPage):
    ITEM_ALL_METRICS = 'metric (All)'

    METRIC_ELEM = '//Text[@Name="%s"]'

    METRICS_XPATH = '//Group/DataGrid/Group/Text'
    METRICS_XPATH_AT = '//Group/DataGrid/Group/Text[%s]'

    METRICS_CONTAINER = '//Group/DataGrid'

    CLICKS_TO_SCROLL = 4

    def click_metric(self, metric_name):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRIC_ELEM % metric_name
        ).click()

    def select_all_metrics(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.ITEM_ALL_METRICS,
            image_name=self.prepare_image_name('select_all_metrics')
        ).click()

    def unselect_all_metrics(self):
        self.get_element_by_name(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.ITEM_ALL_METRICS,
            image_name=self.prepare_image_name('unselect_all_metrics')
        ).click()

    def select_metric_by_number(self, object_number):
        self._find_metric_by_number(object_number).click()

    def get_metric_name(self, object_number):
        return self._find_metric_by_number(object_number).get_name_by_attribute()

    def _find_metric_by_number(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        return popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_XPATH_AT % object_number
        )

    def scroll_into_and_select_metric_by_number(self, object_number):
        """
        Scrolls into metric number object_number using a workaround for the defect in WinAppDriver's moveto command,
        which does not scroll to non-visible element.

        After selecting the element, we scroll back to the top by pressing the HOME key. It's done to ensure scrolling
        always starts at the top. It would be ideal to ensure this before starting to scroll, but not feasible as we
        don't have focus before selecting an element.

        :param object_number: Number of object to scroll to.
        """
        popup_main_element = self.get_add_in_main_element()

        metric_element = self._find_metric_by_number(object_number)

        metrics_container = popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_CONTAINER
        )

        end_time = time.time() + Const.LONG_TIMEOUT
        while metric_element.is_offscreen_by_attribute():
            if time.time() > end_time:
                raise MstrException(f'Timeout while scrolling to metric number {object_number} called '
                                    f'{metric_element.text}, element is still not visible on screen.')

            self._scroll_metrics_down(metrics_container)
            metric_element = self._find_metric_by_number(object_number)

        self._scroll_metrics_down(metrics_container)
        metric_element.move_to_and_click()

        self.press_home()

    def _scroll_metrics_down(self, metrics_container):
        for i in range(ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.CLICKS_TO_SCROLL):
            metrics_container_size = metrics_container.size
            metrics_container.click(metrics_container_size['width'], metrics_container_size['height'])
