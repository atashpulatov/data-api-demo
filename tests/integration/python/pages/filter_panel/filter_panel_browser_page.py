from framework.pages_base.base_browser_page import BaseBrowserPage


class FilterPanelBrowserPage(BaseBrowserPage):
    SELECT_ALL_WITHIN_ALL_PANEL = 'button.all-panel__button:nth-child(1)'
    ALL_PANEL_EMPTY_ELEMENT = '.all-panel__content .category-list-row.disabled .checkbox-cell'
    VIEW_SELECTED_SWITCH_ALL_PANEL = '.all-panel .mstr-switch'
    SEARCH_INPUT = '.all-panel input.search-field__input'
    ALL_PANEL_FIRST_CHECKBOX = '.all-panel .ReactVirtualized__Grid__innerScrollContainer > div:first-child input'

    APPLICATIONS_FIRST_CHECKBOX = '.filter-panel .category-list-wrapper:nth-child(1) ' \
                                  '.category-list-row:nth-child(1) input'
    APPLICATIONS_ALL_PANEL = '.filter-panel div.category-list-wrapper:nth-child(1) > button:nth-child(2)'
    APPLICATION_HEADER = '.filter-panel .category-list-wrapper:nth-child(1) .category-list-header'

    TYPES_REPORT_CHECKBOX = '.filter-panel .category-list-wrapper:nth-child(2) ' \
                            '.category-list-row:nth-child(1) input'
    TYPES_DATASET_CHECKBOX = '.filter-panel .category-list-wrapper:nth-child(2) ' \
                             '.category-list-row:nth-child(2) input'
    TYPES_DOSSIER_CHECKBOX = '.filter-panel .category-list-wrapper:nth-child(2) ' \
                             '.category-list-row:nth-child(3) input'

    CERTIFIED_CHECKBOX = '.filter-panel .category-list-wrapper:nth-child(3) ' \
                         '.category-list-row:nth-child(1) input'
    CERTIFIED_HEADER_ON_MYLIBRARY = '.filter-panel .category-list-wrapper:nth-child(1) .category-list-header'
    CERTIFIED_ELEMENT_ON_MYLIBRARY = '.filter-panel .category-list-wrapper:nth-child(1) .name-cell'

    OWNERS_FIRST_CHECKBOX = '.filter-panel .category-list-wrapper:nth-child(4) ' \
                            '.category-list-row:nth-child(1) input'
    OWNER_ALL_PANEL = '.filter-panel div.category-list-wrapper:nth-child(4) > button:nth-child(2)'
    OWNER_HEADER_ON_MYLIBRARY = '.filter-panel .category-list-wrapper:nth-child(2) .category-list-header'

    MODIFIED_ALL_PANEL = '.filter-panel .mstr-date-range-selector-container > button:nth-child(2)'
    MODIFIED_ALL_PANEL_CHECKBOX = '.all-panel__content .ReactVirtualized__Grid__innerScrollContainer [title="%s"]'
    MODIFIED_HEADER_ON_MYLIBRARY = '.filter-panel .mstr-date-range-selector-header'
    MODIFIED_FROM_FIELD_ON_MYLIBRARY = '.filter-panel .mstr-date-range-selector-container .mstr-date-selector:nth-child(1)'
    MODIFIED_TO_FIELD_ON_MYLIBRARY = '.filter-panel .mstr-date-range-selector-container .mstr-date-selector:nth-child(2)'

    ELEMENT_FROM_CATEGORY = '.category-list-header[aria-label="%s"] + .category-list-table label[title="%s"]'
    ELEMENT_CHECKED = 'input:checked'
    ELEMENT_FROM_CONTENT = '.all-panel__content input[aria-label="%s"]'

    CLEAR_ALL = '.filter-panel .filter-panel__button'

    MAP_ELEMENT_NAME_TO_SELECTOR = {
        'View Selected switch': VIEW_SELECTED_SWITCH_ALL_PANEL,
        'Select All button in All Panel': SELECT_ALL_WITHIN_ALL_PANEL,
        'Search input': SEARCH_INPUT,
        'first checkbox in All Panel': ALL_PANEL_FIRST_CHECKBOX,
        'first checkbox in Applications': APPLICATIONS_FIRST_CHECKBOX,
        'Applications All button': APPLICATIONS_ALL_PANEL,
        'checkbox for Report': TYPES_REPORT_CHECKBOX,
        'checkbox for Dataset': TYPES_DATASET_CHECKBOX,
        'checkbox for Dossier': TYPES_DOSSIER_CHECKBOX,
        'checkbox for Certified': CERTIFIED_CHECKBOX,
        'first checkbox in Owners': OWNERS_FIRST_CHECKBOX,
        'Owners All button': OWNER_ALL_PANEL,
        'Modified All button': MODIFIED_ALL_PANEL,
    }

    def __init__(self):
        super().__init__()

    def click_owner_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.OWNER_ALL_PANEL).click()

    def click_application_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.APPLICATIONS_ALL_PANEL).click()

    def click_modified_all_panel(self):
        self.get_element_by_css(FilterPanelBrowserPage.MODIFIED_ALL_PANEL).click()

    def click_modified_all_panel_element(self, modified_element):
        self.get_element_by_css(FilterPanelBrowserPage.MODIFIED_ALL_PANEL_CHECKBOX % modified_element).click()

    def click_application_all_panel_element(self, application_element):
        element_aria_label = f'Checkbox for {application_element}.'
        self.get_element_by_css(FilterPanelBrowserPage.ELEMENT_FROM_CONTENT % element_aria_label).click()

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
        return element.check_if_element_exists_by_css(FilterPanelBrowserPage.ELEMENT_CHECKED)

    def examine_if_element_has_focus(self, element_name):
        element = self.get_element_by_css_no_visibility_checked(
            FilterPanelBrowserPage.MAP_ELEMENT_NAME_TO_SELECTOR[element_name]
        )

        return element == self.get_element_with_focus()

    def get_certified_header_on_mylibrary_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.CERTIFIED_HEADER_ON_MYLIBRARY).text

    def get_certified_element_on_mylibrary_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.CERTIFIED_ELEMENT_ON_MYLIBRARY).text

    def get_owner_header_on_mylibrary_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.OWNER_HEADER_ON_MYLIBRARY).text

    def get_modified_header_on_mylibrary_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.MODIFIED_HEADER_ON_MYLIBRARY).text

    def get_modified_from_field_on_mylibrary_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.MODIFIED_FROM_FIELD_ON_MYLIBRARY).text

    def get_modified_to_field_on_mylibrary_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.MODIFIED_TO_FIELD_ON_MYLIBRARY).text

    def get_clear_all_on_mylibrary_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.CLEAR_ALL).text

    def get_application_header_title(self):
        return self.get_element_by_css(FilterPanelBrowserPage.APPLICATION_HEADER).text
