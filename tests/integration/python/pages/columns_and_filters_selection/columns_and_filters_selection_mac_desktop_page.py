from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage


class ColumnsAndFiltersSelectionMacDesktopPage(BaseMacDesktopPage):
    IMPORT_BUTTON = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[13]/AXButton[@AXTitle='Import']"

    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[2]/AXStaticText" \
                                                                                      "[@AXValue=" \
                                                                                      "'Columns & Filters Selection']"

    def ensure_columns_and_filters_selection_is_visible(self):
        self.get_element_by_xpath(
            ColumnsAndFiltersSelectionMacDesktopPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT)

    def click_import_button(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.IMPORT_BUTTON).click()

    def click_import_button_to_duplicate(self):
        self.get_element_by_xpath(ColumnsAndFiltersSelectionMacDesktopPage.IMPORT_BUTTON).click()
