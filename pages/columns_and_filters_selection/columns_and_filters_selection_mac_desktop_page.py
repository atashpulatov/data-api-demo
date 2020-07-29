from pages_base.base_mac_desktop_page import BaseMacDesktopPage


class ColumnsAndFiltersSelectionMacDesktopPage(BaseMacDesktopPage):
    ITEM_ALL_ATTRIBUTES = "%s/AXGroup[5]/AXGroup[0]" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ITEM_ALL_METRICS = "%s/AXGroup[7]/AXGroup[0]" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    ATTRIBUTE_CHECKBOX = "%s/AXOutline[0]/AXRow[@AXDescription='%%s']" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    METRIC_CHECKBOX = "%s/AXTable[0]/AXUnknown[0]/AXGroup/" \
                      "AXGroup[@AXDescription='%%s']" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    IMPORT_BUTTON = "%s/AXGroup[13]/AXButton[@AXTitle='Import']" % BaseMacDesktopPage.POPUP_WRAPPER_ELEM

    def __init__(self):
        super().__init__()

    def unselect_all_attributes(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ITEM_ALL_ATTRIBUTES).click()

    def unselect_all_metrics(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ITEM_ALL_METRICS).click()

    def click_attribute(self, attribute_name):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.ATTRIBUTE_CHECKBOX % attribute_name).click()

    def click_metric(self, metric_name):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.METRIC_CHECKBOX % metric_name).click()

    def click_import_button(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.IMPORT_BUTTON).click()
