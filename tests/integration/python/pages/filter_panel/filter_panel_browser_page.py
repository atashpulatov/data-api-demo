from framework.pages_base.base_browser_page import BaseBrowserPage


class FilterPanelBrowserPage(BaseBrowserPage):
    OWNER_ALL_PANEL = 'div.category-list-wrapper:nth-child(4) > button:nth-child(2)'
    SELECT_ALL_WITHIN_ALL_PANEL = 'button.all-panel__button:nth-child(1)'
    ELEMENT_FROM_CATEGORY = '.category-list-header[aria-label="%s"] + .category-list-table label[title="%s"]'
    ALL_PANEL_EMPTY_ELEMENT = '.all-panel__content .category-list-row.disabled .checkbox-cell'
    # FIRST_CATEGORY_FIRST_CHECKBOX = 'div.category-list-wrapper:nth-child(1) input'
    # FIRST_CATEGORY_FIRST_CHECKBOX = 'div.category-list-wrapper:nth-child(1) input:nth-child(1)'
    APPLICATIONS_CATEGORY_CHECKBOXES = 'div.category-list-wrapper:nth-child(1) input'
    TYPES_CATEGORY_CHECKBOXES = 'div.category-list-wrapper:nth-child(2) input'
    VIEW_SELECTED_SWITCH = '.all-panel .mstr-switch'

    ELEMENT_CHECKED = 'input:checked'

    MAP_ELEMENT_NAME_TO_SELECTOR = {
        'View Selected switch': '.all-panel .mstr-switch',
        'first checkbox in Applications category': 'div.category-list-table:nth-of-type(1) input:nth-of-type(1)'
    }

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

    def examine_if_element_has_focus(self, element_name):
        return (self.get_element_by_css(FilterPanelBrowserPage.MAP_ELEMENT_NAME_TO_SELECTOR[element_name])
                == self.get_element_with_focus())
