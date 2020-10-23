from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ColumnsAndFiltersSelectionMetricsWindowsDesktopPage(BaseWindowsDesktopPage):
    ITEM_ALL_METRICS = 'metric(All)'

    METRIC_ELEM = '//Text[@Name="%s"]'

    METRICS_XPATH = '//Group/DataGrid/Group/Text'
    METRICS_XPATH_AT = '//Group/DataGrid/Group/Text[%s]'

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
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_XPATH_AT % object_number
        ).click()

    def get_metric_name(self, object_number):
        popup_main_element = self.get_add_in_main_element()
        metric_elements = popup_main_element.get_elements_by_xpath(ColumnsAndFiltersSelectionMetricsWindowsDesktopPage.METRICS_XPATH)
        
        return metric_elements[int(object_number) - 1].get_name_by_attribute()
