from framework.pages_base.base_browser_page import BaseBrowserPage


class FilterPanelBrowserPage(BaseBrowserPage):
    OWNER_ALL_PANEL = 'div.category-list-wrapper:nth-child(4) > button:nth-child(2)'
    SELECT_ALL_WITHIN_ALL_PANEL = 'button.all-panel__button:nth-child(1)'
    ELEMENT_FROM_CATEGORY = '.category-list-header[aria-label="%s"] + .category-list-table label[title="%s"]'
    ALL_PANEL_EMPTY_ELEMENT = '.all-panel__content .category-list-row.disabled .checkbox-cell'

    ELEMENT_CHECKED = 'input:checked'

    def __init__(self):
        super().__init__()

    def click_owner_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.OWNER_ALL_PANEL).click()

    def click_select_all_within_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.SELECT_ALL_WITHIN_ALL_PANEL).click()

    def click_element_from_list(self, category, element):
        self.get_element_by_css(FilterPanelBrowserPage.ELEMENT_FROM_CATEGORY % (category, element)).click()

    def get_all_panel_first_empty_element(self):
        return self.get_element_by_css(FilterPanelBrowserPage.ALL_PANEL_EMPTY_ELEMENT)

    def click_all_panel_first_empty_element(self):
        return self.get_all_panel_first_empty_element().click()

    def examine_if_first_empty_element_is_checked(self):
        element = self.get_all_panel_first_empty_element()

        return self._examine_if_element_is_checked(element)

    def _examine_if_element_is_checked(self, element):
        return element.check_if_child_element_exists_by_css(FilterPanelBrowserPage.ELEMENT_CHECKED)
