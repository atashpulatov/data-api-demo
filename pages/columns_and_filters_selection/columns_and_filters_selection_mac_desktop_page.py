from pages.base_mac_desktop_page import BaseMacDesktopPage


class ColumnsAndFiltersSelectionMacDesktopPage(BaseMacDesktopPage):
    ITEM_ALL_ATTRIBUTES = "%s/AXGroup[5]/AXGroup[0]" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ITEM_ALL_METRICS = "%s/AXGroup[7]/AXGroup[0]" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ATTRIBUTE_CHECKBOX = "%s/AXOutline[0]/AXRow[@AXDescription='%s']"
    METRIC_CHECKBOX = "%s/AXTable[0]/AXUnknown[0]/AXGroup/AXGroup[@AXDescription='%s']"
    IMPORT_BUTTON = "%s/AXGroup[13]/AXButton[@AXTitle='Import']" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    CHECKBOX_OFFSET_X = 22
    CHECKBOX_OFFSET_Y = 15

    def __init__(self):
        super().__init__()

    def unselect_all_attributes(self):
        self.get_element_by_xpath(self.ITEM_ALL_ATTRIBUTES).click()

    def unselect_all_metrics(self):
        self.get_element_by_xpath(self.ITEM_ALL_METRICS).click()

    def click_attribute(self, attribute_name):
        self._click_checkbox_element(self.ATTRIBUTE_CHECKBOX, attribute_name)

    def click_metric(self, metric_name):
        self._click_checkbox_element(self.METRIC_CHECKBOX, metric_name)

    def _click_checkbox_element(self, selector, element_name):
        formatted_selector = selector % (BaseMacDesktopPage.POPUP_WRAPPER_ELEM, element_name)

        self.get_element_by_xpath(formatted_selector).click(offset_x=self.CHECKBOX_OFFSET_X,
                                                            offset_y=self.CHECKBOX_OFFSET_Y)

    def click_import_button(self):
        self.get_element_by_xpath(self.IMPORT_BUTTON).click()
