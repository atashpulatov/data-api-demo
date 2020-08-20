import json

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import LONG_TIMEOUT
from framework.util.exception.MstrException import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class ColumnsAndFiltersSelectionBrowserPage(BaseBrowserPage):
    ATTRIBUTES_CHECKBOX = '.item-title'
    METRIC_ITEM = 'label.checkbox[aria-label="%s"]'
    FIRST_CLOSED_ATTRIBUTE_FORM_SWITCHER = 'div:nth-child(1) > div > div.checkbox-list.all-showed > div > div > ' \
                                           'div.attribute-forms > ul > ' \
                                           'li.ant-tree-treenode-switcher-close.ant-tree-treenode-checkbox-checked > ' \
                                           'span.ant-tree-switcher'

    ALL_ATTRIBUTES = '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > ' \
                     'div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > ' \
                     'div.checkbox-list.all-showed > div > div > label.mstr-office-checkbox-all'

    ALL_METRICS = '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > ' \
                  'div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.metrics-col > div > ' \
                  'div.checkbox-list.all-showed > div > div > label'

    ATTRIBUTE_FORM_DROPDOWN = '.ant-select-selection--single'
    ATTRIBUTE_FORM_DROP_DOWN_ITEM = '.ant-select-dropdown-menu-item'

    IMPORT_BUTTON_ELEM = 'import'

    NOTIFICATION_TEXT_ELEM = '.selection-title'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'

    ROOT_ATTRIBUTE_CONTAINER = 'div.ant-col.ant-col-6.attributes-col'
    ATTRIBUTES_CONTAINER = ROOT_ATTRIBUTE_CONTAINER + ' > div > div.checkbox-list.all-showed > div > div > div > ul'
    ATTRIBUTE_ELEMENT_AT = ATTRIBUTES_CONTAINER + ' > li:nth-child(%s)'
    ATTRIBUTES_TITLE_SORT = ROOT_ATTRIBUTE_CONTAINER + ' > div > div.selector-title > div'
    ATTRIBUTE_FORM_ARROW_COLLAPSED = ATTRIBUTE_ELEMENT_AT + ' > span.ant-tree-switcher.ant-tree-switcher_close'
    ATTRIBUTE_FORM_ARROW_EXPANDED = ATTRIBUTE_ELEMENT_AT + ' > span.ant-tree-switcher.ant-tree-switcher_open'
    ATTRIBUTE_FORM_ELEMENT_CONTAINER = ' > ul > li:nth-child(%s)'

    EXPAND_ATTRIBUTE_FORMS = 'expand'
    COLLAPSE_ATTRIBUTE_FORMS = 'collapse'

    ROOT_METRIC_CONTAINER = 'div.ant-col.ant-col-6.metrics-col'
    METRICS_CONTAINER = ROOT_METRIC_CONTAINER + ' > div > div.checkbox-list.all-showed > div > div > ' \
                                                'div:nth-child(2) > div > div'
    METRIC_ELEMENT_AT = METRICS_CONTAINER + ' > div:nth-child(%s)'
    METRICS_TITLE_SORT = ROOT_METRIC_CONTAINER + ' > div > div.selector-title > div'

    ROOT_FILTER_CONTAINER = 'div.ant-col.ant-col-12.filters-col > div > div:nth-child(1)'
    FILTERS_CONTAINER = ROOT_FILTER_CONTAINER + ' > div.filter-list.ant-list > div > div > ul'
    FILTER_ELEMENT_AT = FILTERS_CONTAINER + ' > li:nth-child(%s)'
    FILTERS_TITLE_SORT = ROOT_FILTER_CONTAINER + ' > div.selector-title.filter-selector-title > div'

    ARIA_SORT = 'aria-sort'
    SORT_ASCENDING = 'ascending'
    SORT_DESCENDING = 'descending'

    SEARCH_INPUT = '.ant-input.ant-input-sm'

    ATTRIBUTE = 'attributes'
    METRIC = 'metrics'
    FILTER = 'filters'

    TRY_LIMIT_FOR_SORT = 3
    TRY_LIMIT_FOR_SORT_BY_KEYBOARD = 6

    OBJECT_TO_TITLE_CONTAINER = {
        ATTRIBUTE: ATTRIBUTES_TITLE_SORT,
        METRIC: METRICS_TITLE_SORT,
        FILTER: FILTERS_TITLE_SORT
    }

    OBJECT_TO_OBJECT_CONTAINER = {
        ATTRIBUTE: ATTRIBUTE_ELEMENT_AT,
        METRIC: METRIC_ELEMENT_AT,
        FILTER: FILTER_ELEMENT_AT
    }

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def ensure_columns_and_filters_selection_is_visible(self):
        self.wait_for_element_to_have_attribute_value_by_css(
            ColumnsAndFiltersSelectionBrowserPage.NOTIFICATION_TEXT_ELEM,
            ColumnsAndFiltersSelectionBrowserPage.TEXT_CONTENT_ATTRIBUTE,
            ColumnsAndFiltersSelectionBrowserPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT
        )

    def click_attribute(self, attribute_name):
        self.focus_on_excel_popup_frame()

        attribute = self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTES_CHECKBOX,
            attribute_name
        )

        attribute.click(offset_x=10, offset_y=5)

    def click_metric(self, metric_name):
        self.focus_on_excel_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.METRIC_ITEM % metric_name).click()

    def click_display_attributes_names_type(self, form_visualization_type):
        self.focus_on_excel_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROPDOWN).click()

        self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM, form_visualization_type)

    def select_all_attributes(self):
        self.focus_on_excel_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_ATTRIBUTES).click()

    def unselect_all_attributes(self):
        self.focus_on_excel_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_ATTRIBUTES).click()

    def select_all_metrics(self):
        self.focus_on_excel_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_METRICS).click()

    def unselect_all_metrics(self):
        self.focus_on_excel_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_METRICS).click()

    def click_attributes_and_forms(self, attributes_and_forms_json):
        self.focus_on_excel_popup_frame()

        attributes_and_forms = json.loads(attributes_and_forms_json)

        for attribute_name, form_names in attributes_and_forms.items():
            self.click_attribute(attribute_name)

            if len(form_names) > 0:
                self.get_element_by_css(
                    ColumnsAndFiltersSelectionBrowserPage.FIRST_CLOSED_ATTRIBUTE_FORM_SWITCHER).click()

                for form_name in form_names:
                    self.click_attribute(form_name)

    def select_element_by_number(self, object_type, object_number):
        self.focus_on_excel_popup_frame()

        element = ColumnsAndFiltersSelectionBrowserPage.OBJECT_TO_OBJECT_CONTAINER[object_type] % object_number

        self.get_element_by_css(element).click()

    def expand_attribute_form(self, object_number):
        self.focus_on_excel_popup_frame()

        attribute_form_arrow = self.get_element_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ARROW_COLLAPSED % object_number)

        attribute_form_arrow.click()

    def collapse_attribute_form(self, object_number):
        self.focus_on_excel_popup_frame()

        attribute_form_arrow = self.get_element_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ARROW_EXPANDED % object_number)

        attribute_form_arrow.click()

    def get_attribute_form_name(self, attribute_form_number, attribute_number):
        self.focus_on_excel_popup_frame()

        attribute_element_container = ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_ELEMENT_AT % attribute_number
        attribute_form_element = self.get_element_by_css(
            attribute_element_container +
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ELEMENT_CONTAINER % attribute_form_number
        )

        return attribute_form_element.text

    def get_attribute_name(self, object_number):
        return self._get_object_name(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_ELEMENT_AT % object_number)

    def get_metric_name(self, object_number):
        return self._get_object_name(ColumnsAndFiltersSelectionBrowserPage.METRIC_ELEMENT_AT % object_number)

    def get_filter_name(self, object_number):
        return self._get_object_name(ColumnsAndFiltersSelectionBrowserPage.FILTER_ELEMENT_AT % object_number)

    def _get_object_name(self, object_selector):
        self.focus_on_excel_popup_frame()

        name_input = self.get_element_by_css(object_selector)

        return name_input.text

    def sort_elements_ascending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionBrowserPage.SORT_ASCENDING)

    def sort_elements_descending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionBrowserPage.SORT_DESCENDING)

    def sort_elements_default_by_click(self, object_type):
        self._sort_elements_by_click(object_type, None)

    def _sort_elements_by_click(self, object_type, sorting_type):
        self.focus_on_excel_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionBrowserPage.OBJECT_TO_TITLE_CONTAINER[object_type]
        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionBrowserPage.TRY_LIMIT_FOR_SORT):
            aria_value = sort_element.get_attribute(ColumnsAndFiltersSelectionBrowserPage.ARIA_SORT)

            if aria_value == sorting_type:
                return

            sort_element.click()

        raise MstrException('Click limit is reached. Selector could not be found')

    def search_for_element(self, element_name):
        self.focus_on_excel_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.send_keys_with_check(element_name)

    def clear_search_element(self):
        self.focus_on_excel_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.clear()

    def clear_element_search_with_backspace(self):
        self.focus_on_excel_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.click()

        while search_box.get_attribute("value") != '':
            self.press_right_arrow()
            self.press_backspace()

    def press_tab_until_object_type_focused(self, object_type):
        self.focus_on_excel_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionBrowserPage.OBJECT_TO_TITLE_CONTAINER[object_type]
        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionBrowserPage.TRY_LIMIT_FOR_SORT_BY_KEYBOARD):
            if sort_element == self.get_element_with_focus():
                return

            self.press_tab()

        raise MstrException('Tab limit is reached. Element could not found')

    def press_enter_to_sort_element_ascending(self, object_type):
        self._sort_elements_by_keyboard(object_type, ColumnsAndFiltersSelectionBrowserPage.SORT_ASCENDING)

    def press_enter_to_sort_element_descending(self, object_type):
        self._sort_elements_by_keyboard(object_type, ColumnsAndFiltersSelectionBrowserPage.SORT_DESCENDING)

    def press_enter_to_sort_element_default(self, object_type):
        self._sort_elements_by_keyboard(object_type, None)

    def _sort_elements_by_keyboard(self, object_type, sorting_type):
        self.focus_on_excel_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionBrowserPage.OBJECT_TO_TITLE_CONTAINER[object_type]
        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionBrowserPage.TRY_LIMIT_FOR_SORT_BY_KEYBOARD):
            aria_value = sort_element.get_attribute(ColumnsAndFiltersSelectionBrowserPage.ARIA_SORT)

            if aria_value == sorting_type:
                return

            self.press_enter()

        raise MstrException('Tab limit is reached. Element could not be found')

    def scroll_into_object_by_number(self, object_number, object_type):
        self.focus_on_excel_popup_frame()

        element = ColumnsAndFiltersSelectionBrowserPage.OBJECT_TO_OBJECT_CONTAINER[object_type] % object_number
        self.get_element_by_css_no_visibility_checked(element).move_to()

    def click_import_button(self):
        self.focus_on_excel_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully(timeout=LONG_TIMEOUT)

    def click_import_button_to_duplicate(self):
        self.focus_on_excel_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_duplicate_object_to_finish_successfully(timeout=LONG_TIMEOUT)
