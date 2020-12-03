import json

from framework.pages_base.base_browser_page import BaseBrowserPage


class ColumnsAndFiltersSelectionFiltersBrowserPage(BaseBrowserPage):
    FILTER_ITEM = 'label.checkbox[aria-label="%s"]'
    FILTER_TITLE_ITEM = '.filter-title'

    ALL_FILTERS = '.filters-col .mstr-office-checkbox-all'

    ROOT_FILTER_CONTAINER = '.filters-col > div > div:nth-child(1)'
    FILTERS_CONTAINER = ROOT_FILTER_CONTAINER + ' > .filter-list > div > div > ul'
    FILTER_ELEMENT_AT = FILTERS_CONTAINER + ' > li:nth-child(%s)'

    FIRST_FILTER = '.filters-col .ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal'

    def click_filter(self, filter_name):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionFiltersBrowserPage.FILTER_ITEM % filter_name).click()

    def select_filter_elements(self, filters_and_elements_json):
        self.focus_on_add_in_popup_frame()

        filters_and_elements = json.loads(filters_and_elements_json)

        for filter_name, elements_names in filters_and_elements.items():
            self._select_filter(filter_name)

            if len(elements_names) > 0:
                for element_name in elements_names:
                    self.find_element_by_text_in_elements_list_by_css(
                        'span',
                        element_name
                    ).click()

    def select_all_filter_elements(self, filter_name):
        self.focus_on_add_in_popup_frame()
        self._select_filter(filter_name)

        self.get_element_by_css(ColumnsAndFiltersSelectionFiltersBrowserPage.ALL_FILTERS).click()

    def _select_filter(self, filter_name):
        filter_item = self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionFiltersBrowserPage.FILTER_TITLE_ITEM,
            filter_name
        )

        filter_item.click()

    def select_filter_by_number(self, object_number):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionFiltersBrowserPage.FILTER_ELEMENT_AT % object_number).click()

    def get_filter_name(self, object_number):
        self.focus_on_add_in_popup_frame()

        return self.get_element_by_css(
            ColumnsAndFiltersSelectionFiltersBrowserPage.FILTER_ELEMENT_AT % object_number
        ).text

    def scroll_into_and_select_filter_by_number(self, object_number):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css_no_visibility_checked(
            ColumnsAndFiltersSelectionFiltersBrowserPage.FILTER_ELEMENT_AT % object_number
        ).move_to_and_click()

    def hover_over_first_filter(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionFiltersBrowserPage.FIRST_FILTER).move_to()

    def select_first_filter(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionFiltersBrowserPage.FIRST_FILTER).click()

    def get_background_color_of_first_filter(self):
        element = self.get_element_by_css(ColumnsAndFiltersSelectionFiltersBrowserPage.FIRST_FILTER)

        return element.get_background_color()
