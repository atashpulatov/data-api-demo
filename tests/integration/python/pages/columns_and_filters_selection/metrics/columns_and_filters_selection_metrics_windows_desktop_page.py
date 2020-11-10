from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import MEDIUM_TIMEOUT
from framework.util.exception.MstrException import MstrException
from selenium.webdriver.common.keys import Keys


class ColumnsAndFiltersSelectionMetricsWindowsDesktopPage(BaseWindowsDesktopPage):
    ITEM_ALL_METRICS = 'metric(All)'

    METRIC_ELEM = '//Text[@Name="%s"]'

    METRICS_XPATH = '//Group/DataGrid/Group/Text'
    METRICS_XPATH_AT = '//Group/DataGrid/Group/Text[%s]'

    METRICS_CONTAINER = '//Group/DataGrid'

    CLICKS_TO_SCROLL = 4
    METRIC_SEARCH_RANGE = 10

    def click_metric(self, metric_name):
        metric_to_click = self._prepare_metric_to_click(metric_name)

        if metric_to_click:
            metric_to_click.click()

        raise MstrException("Metric with metric name %s not found" % metric_name)

    def _prepare_metric_to_click(self, metric_name):
        popup_main_element = self.get_add_in_main_element()
        try:
            return popup_main_element.get_element_by_xpath(
                ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRIC_ELEM % metric_name,
                timeout=MEDIUM_TIMEOUT
            )
        except MstrException:
            self.log(f'Metric with metric name [{metric_name}] not found in visible elements, '
                     'scroll into it before selecting it.')

        return None

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
        object_index = int(object_number) - 1

        popup_main_element = self.get_add_in_main_element()

        visible_metrics = popup_main_element.get_elements_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_XPATH
        )

        if object_index < len(visible_metrics):
            return visible_metrics[object_index]
        else:
            raise MstrException(f'Metric number {object_number} is not visible. Scroll into it before selecting it.')

    def scroll_into_and_select_metric_by_number(self, object_number):
        popup_main_element = self.get_add_in_main_element()

        metric = self._find_metric_by_number(object_number)

        metrics_container = popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_CONTAINER
        )

        while metric.is_offscreen_by_attribute():
            self._scroll_metrics_down(metrics_container)
            metric = self._find_metric_by_number()

        self._scroll_metrics_down(metrics_container)
        metric.move_to_and_click()

        self.send_keys(Keys.HOME)

    def _scroll_metrics_down(self, metrics_container):
        for i in range(ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.CLICKS_TO_SCROLL):
            metrics_container_size = metrics_container.size
            metrics_container.click(metrics_container_size['width'], metrics_container_size['height'])
