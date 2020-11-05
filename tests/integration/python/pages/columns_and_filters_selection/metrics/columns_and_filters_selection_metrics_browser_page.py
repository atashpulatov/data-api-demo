from framework.pages_base.base_browser_page import BaseBrowserPage


class ColumnsAndFiltersSelectionMetricsBrowserPage(BaseBrowserPage):
    METRIC_ITEM = 'label.checkbox[aria-label="%s"]'

    ALL_METRICS = '.metrics-col .mstr-office-checkbox-all'

    ROOT_METRIC_CONTAINER = '.metrics-col'
    METRICS_CONTAINER = ROOT_METRIC_CONTAINER + ' .selector-list > div'
    METRIC_ELEMENT_AT = METRICS_CONTAINER + ' > div:nth-child(%s)'

    def click_metric(self, metric_name):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionMetricsBrowserPage.METRIC_ITEM % metric_name).click()

    def select_all_metrics(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionMetricsBrowserPage.ALL_METRICS).click()

    def unselect_all_metrics(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionMetricsBrowserPage.ALL_METRICS).click()

    def select_metric_by_number(self, object_type, object_number):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(
            ColumnsAndFiltersSelectionMetricsBrowserPage.METRIC_ELEMENT_AT % object_number
        ).click()

    def get_metric_name(self, object_number):
        self.focus_on_add_in_popup_frame()

        return self._get_object_name(ColumnsAndFiltersSelectionMetricsBrowserPage.METRIC_ELEMENT_AT % object_number)

    def _get_object_name(self, object_selector):
        self.focus_on_add_in_popup_frame()

        name_input = self.get_element_by_css(object_selector)

        return name_input.text

    def scroll_into_and_select_metric_by_number(self, object_number):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css_no_visibility_checked(
            ColumnsAndFiltersSelectionMetricsBrowserPage.METRIC_ELEMENT_AT % object_number
        ).move_to_and_click()
