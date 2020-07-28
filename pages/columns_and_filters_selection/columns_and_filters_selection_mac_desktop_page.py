from pages.base_mac_desktop_page import BaseMacDesktopPage


class ColumnsAndFiltersSelectionMacDesktopPage(BaseMacDesktopPage):
    ITEM_ALL_ATTRIBUTES = "{prefix}/AXGroup[5]/AXGroup[0]".format(
        prefix=BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    )
    ITEM_ALL_METRICS = "{prefix}/AXGroup[7]/AXGroup[0]".format(
        prefix=BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    )
    ATTRIBUTE_CHECKBOX = "{prefix}/AXOutline[0]/AXRow[@AXDescription='{attribute}']"
    METRIC_CHECKBOX = (
        "{prefix}/AXTable[0]/AXUnknown[0]/AXGroup/AXGroup[@AXDescription='{attribute}']"
    )
    IMPORT_BUTTON = "{prefix}/AXGroup[13]/AXButton[@AXTitle='Import']".format(
        prefix=BaseMacDesktopPage.POPUP_WRAPPER_ELEM
    )
    OFFSET_X = 22
    OFFSET_Y = 15

    def __init__(self):
        super().__init__()

    def unselect_all_attributes(self):
        self.get_element_by_xpath(self.ITEM_ALL_ATTRIBUTES).click()

    def unselect_all_metrics(self):
        self.get_element_by_xpath(self.ITEM_ALL_METRICS).click()

    def click_attribute(self, attribute_name):
        self._click_element(self.ATTRIBUTE_CHECKBOX, attribute_name)

    def click_metric(self, metric_name):
        self._click_element(self.METRIC_CHECKBOX, metric_name)

    def _click_element(self, selector, element_name):
        formatted_selector = selector.format(
            prefix=BaseMacDesktopPage.POPUP_WRAPPER_ELEM, attribute=element_name
        )

        self.get_element_by_xpath(formatted_selector).click(
            offset_x=self.OFFSET_X, offset_y=self.OFFSET_Y
        )

    def click_import_button(self):
        self.get_element_by_xpath(self.IMPORT_BUTTON).click()
