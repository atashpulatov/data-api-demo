from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage


class ColumnsAndFiltersSelectionMetricsMacDesktopPage(BaseMacDesktopPage):
    ITEM_ALL_METRICS = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[7]/AXGroup[0]"

    METRIC_CHECKBOX = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXTable[0]/AXUnknown[0]/" \
                                                              "AXGroup/AXGroup[@AXDescription='%s']"

    def unselect_all_metrics(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMetricsMacDesktopPage.ITEM_ALL_METRICS).click()

    def select_all_metrics(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMetricsMacDesktopPage.ITEM_ALL_METRICS).click()

    def click_metric(self, metric_name):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMetricsMacDesktopPage.METRIC_CHECKBOX % metric_name).click()
