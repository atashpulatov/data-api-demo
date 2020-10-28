from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException

from selenium.webdriver.common.keys import Keys


class ColumnsAndFiltersSelectionMetricsWindowsDesktopPage(BaseWindowsDesktopPage):
    ITEM_ALL_METRICS = 'metric(All)'

    METRIC_ELEM = '//Text[@Name="%s"]'

    METRICS_XPATH = '//Group/DataGrid/Group/Text'
    METRICS_XPATH_AT = '//Group/DataGrid/Group/Text[%s]'

    METRICS_CONTAINER = '//Group/DataGrid'

    all_metrics = []

    # TODO: refactor in case metric is not visible
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

    def _find_metric_by_number(self, object_number):
        object_index = int(object_number) - 1
        
        popup_main_element = self.get_add_in_main_element()

        visible_metrics = popup_main_element.get_elements_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_XPATH
        )

        if object_index < len(visible_metrics):
            return visible_metrics[object_index]
        else:
            return self._get_all_metrics()[object_index]

    #  Workaround as non-visible metrics are not in page source
    def _get_all_metrics(self):
        if self.all_metrics:
            return self.all_metrics

        popup_main_element = self.get_add_in_main_element()

        metrics_container = popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_CONTAINER
        )

        all_metrics = []

        for i in range(10):  # Cap the search for 10 loops
            visible_metrics = popup_main_element.get_elements_by_xpath(
                ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_XPATH
            )
            updated_metrics = all_metrics + list(filter(lambda m: m not in all_metrics, visible_metrics))

            if updated_metrics == all_metrics:
                self.all_metrics = all_metrics
                return all_metrics
            else:
                all_metrics = updated_metrics

            for j in range(4):  # Scroll at least 4 times before checking if attribute is visible
                metrics_container.click(metrics_container.size['width'], metrics_container.size['height'])

        raise MstrException('There are too many metrics in this dataset, search has been capped.')

    def get_metric_name(self, object_number):
        return self._find_metric_by_number(object_number).get_name_by_attribute()

    def scroll_into_metric_by_number(self, object_number):
        self._get_all_metrics()[int(object_number) - 1].move_to()
