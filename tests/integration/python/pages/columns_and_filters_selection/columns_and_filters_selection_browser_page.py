import json

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import LONG_TIMEOUT, SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class ColumnsAndFiltersSelectionBrowserPage(BaseBrowserPage):
    ATTRIBUTES_CHECKBOX = '.item-title'
    ATTRIBUTES_IN_DATASET_CHECKBOX = '.ant-checkbox-wrapper'
    METRIC_ITEM = 'label.checkbox[aria-label="%s"]'
    FILTER_ITEM = '.filter-title'
    CLOSE_POPUP = '#WACDialogTitlePanel > a'

    ALL_ATTRIBUTES = '.attributes-col .mstr-office-checkbox-all'
    ALL_METRICS = '.metrics-col .mstr-office-checkbox-all'
    ALL_FILTERS = '.filters-col .mstr-office-checkbox-all'

    ATTRIBUTE_FORM_DROPDOWN = '.ant-select-selection--single'
    ATTRIBUTE_FORM_DROP_DOWN_ITEM = '.ant-select-dropdown-menu-item'

    IMPORT_BUTTON_ELEM = 'import'
    BACK_BUTTON_ELEM = 'back'
    CANCEL_BUTTON_ELEM = 'cancel'

    NOTIFICATION_TEXT_ELEM = '.selection-title'
    TEXT_CONTENT_ATTRIBUTE = 'textContent'
    COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT = 'Columns & Filters Selection'
    REPORT_TITLE = '.folder-browser-title > span:nth-child(2)'

    PARENT_ATTRIBUTE_ELEMENTS = '.attribute-forms li'
    CHILD_ATTRIBUTE_ELEMENT = 'span > span > .item-title'
    ATTRIBUTE_FORMS = 'ul li[role="treeitem"] .item-title'
    ATTRIBUTE_FORM_ARROW_COLLAPSED = '.ant-tree-switcher_close'
    ATTRIBUTE_FORM_ARROW_EXPANDED = '.ant-tree-switcher_open'

    ROOT_ATTRIBUTE_CONTAINER = '.attributes-col'
    ATTRIBUTES_CONTAINER = ROOT_ATTRIBUTE_CONTAINER + ' > div > .checkbox-list.all-showed > div > div > div > ul'  # might not work for datasets
    ATTRIBUTE_ELEMENT_AT = ATTRIBUTES_CONTAINER + ' > li:nth-child(%s)'
    ATTRIBUTES_TITLE_SORT = ROOT_ATTRIBUTE_CONTAINER + ' > div > .selector-title > div'
    ATTRIBUTE_FORM_ARROW_COLLAPSED_ELEMENT_AT = (
            ATTRIBUTE_ELEMENT_AT + ' > span.ant-tree-switcher' + ATTRIBUTE_FORM_ARROW_COLLAPSED
    )
    ATTRIBUTE_FORM_ARROW_EXPANDED_ELEMENT_AT = (
            ATTRIBUTE_ELEMENT_AT + ' > span.ant-tree-switcher' + ATTRIBUTE_FORM_ARROW_EXPANDED
    )
    ATTRIBUTE_FORM_ELEMENT_CONTAINER = ' > ul > li:nth-child(%s)'

    EXPAND_ATTRIBUTE_FORMS = 'expand'
    COLLAPSE_ATTRIBUTE_FORMS = 'collapse'

    ROOT_METRIC_CONTAINER = '.metrics-col'
    METRICS_CONTAINER = ROOT_METRIC_CONTAINER + ' .selector-list > div'
    METRIC_ELEMENT_AT = METRICS_CONTAINER + ' > div:nth-child(%s)'
    METRICS_TITLE_SORT = ROOT_METRIC_CONTAINER + ' > div > .selector-title > div'

    ROOT_FILTER_CONTAINER = '.filters-col > div > div:nth-child(1)'
    FILTERS_CONTAINER = ROOT_FILTER_CONTAINER + ' > .filter-list > div > div > ul'
    FILTER_ELEMENT_AT = FILTERS_CONTAINER + ' > li:nth-child(%s)'
    FILTERS_TITLE_SORT = ROOT_FILTER_CONTAINER + ' > .filter-selector-title > div'

    ARIA_SORT = 'aria-sort'
    SORT_ASCENDING = 'ascending'
    SORT_DESCENDING = 'descending'

    ATTRIBUTES_SORT_TITLE = '.attributes-col .sort-title-section'
    METRICS_SORT_TITLE = '.metrics-col .sort-title-section'
    FILTER_SORT_TITLE = '.filters-col .sort-title-section'

    SEARCH_INPUT = '.search-input > input'

    TOTALS_AND_SUBTOTALS_SWITCH = '.subtotal-container > button.ant-switch'

    TRY_LIMIT_FOR_SORT = 3
    TRY_LIMIT_FOR_SORT_BY_KEYBOARD = 6

    ATTRIBUTES = 'attributes'
    METRICS = 'metrics'
    FILTERS = 'filters'

    OBJECTS_TYPE_TO_TITLE_GROUP = {
        ATTRIBUTES: ATTRIBUTES_TITLE_SORT,
        METRICS: METRICS_TITLE_SORT,
        FILTERS: FILTERS_TITLE_SORT
    }

    OBJECTS_TYPE_TO_OBJECTS_COLUMN_TITLE_GROUP = {
        ATTRIBUTES: ATTRIBUTES_SORT_TITLE,
        METRICS: METRICS_SORT_TITLE,
        FILTERS: FILTER_SORT_TITLE
    }

    OBJECTS_TYPE_TO_OBJECTS_GROUP = {
        ATTRIBUTES: ATTRIBUTE_ELEMENT_AT,
        METRICS: METRIC_ELEMENT_AT,
        FILTERS: FILTER_ELEMENT_AT
    }

    CHECKED_CHECKBOX_CLASS = '.ant-tree-checkbox.ant-tree-checkbox-checked'

    FIRST_FILTER = '.filters-col .ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def ensure_columns_and_filters_selection_is_visible(self):
        self.wait_for_element_to_have_attribute_value_by_css(
            ColumnsAndFiltersSelectionBrowserPage.NOTIFICATION_TEXT_ELEM,
            ColumnsAndFiltersSelectionBrowserPage.TEXT_CONTENT_ATTRIBUTE,
            ColumnsAndFiltersSelectionBrowserPage.COLUMNS_AND_FILTERS_SELECTION_OPEN_TEXT
        )

    def ensure_popup_title_is_correct(self, title):
        self.wait_for_element_to_have_attribute_value_by_css(
            ColumnsAndFiltersSelectionBrowserPage.REPORT_TITLE,
            ColumnsAndFiltersSelectionBrowserPage.TEXT_CONTENT_ATTRIBUTE,
            title
        )

    def ensure_item_selection(self, item_type, number, of_number):
        """
        Ensures proper number of given item type is selected.

        :param item_type: type of item (metrics / attributes / filters)
        :param number: number of selected items
        :param of_number: number of all items
        """

        if item_type not in ColumnsAndFiltersSelectionBrowserPage.OBJECTS_TYPE_TO_OBJECTS_COLUMN_TITLE_GROUP:
            raise MstrException(f'Wrong item_type [{item_type}] argument passed to ensure_item_selection')

        sort_title_selector = ColumnsAndFiltersSelectionBrowserPage.OBJECTS_TYPE_TO_OBJECTS_COLUMN_TITLE_GROUP[
            item_type]

        title = f'{item_type.upper()} ({number}/{of_number})'
        column_name = self.get_sort_column_name(sort_title_selector)

        if column_name == title:
            return

        raise MstrException(f'{item_type} selection does not match - selector: {column_name}, text: {title}.')

    def click_attribute(self, attribute_name):
        attribute = self._get_attribute_checkbox(
            attribute_name,
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTES_CHECKBOX
        )
        attribute.click(offset_x=10, offset_y=5)

    def click_attribute_for_dataset(self, attribute_name):
        attribute = self._get_attribute_checkbox(
            attribute_name,
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTES_IN_DATASET_CHECKBOX
        )
        attribute.click(offset_x=10, offset_y=5)

    def _get_attribute_checkbox(self, attribute_name, attribute_selector):
        self.focus_on_add_in_popup_frame()

        return self.find_element_by_text_in_elements_list_by_css(
            attribute_selector,
            attribute_name
        )

    def click_metric(self, metric_name):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.METRIC_ITEM % metric_name).click()

    def click_filter(self, filter_name):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.METRIC_ITEM % filter_name).click()

    def select_display_attributes_form_names_element(self, form_visualization_type):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROPDOWN).click()

        self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM, form_visualization_type)

    def select_all_attributes(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_ATTRIBUTES).click()

    def unselect_all_attributes(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_ATTRIBUTES).click()

    def select_all_metrics(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_METRICS).click()

    def unselect_all_metrics(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_METRICS).click()

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

    def select_all_filter_elements(self, filter):
        self.focus_on_add_in_popup_frame()
        self._select_filter(filter)

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ALL_FILTERS).click()

    def _select_filter(self, filter):
        filter_item = self.find_element_by_text_in_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.FILTER_ITEM,
            filter
        )

        filter_item.click()

    def ensure_attribute_is_selected_and_click_forms(self, attributes_and_forms_json):
        self.focus_on_add_in_popup_frame()

        attributes_and_forms = json.loads(attributes_and_forms_json)

        for attribute_name, form_names in attributes_and_forms.items():
            attribute_element = self._get_attribute_element(attribute_name)

            self._ensure_attribute_is_selected(attribute_element)

            self._click_forms(attribute_element, form_names)

    def _get_attribute_element(self, attribute_name):
        return self.get_parent_element_by_child_text_from_parent_elements_list_by_css(
            ColumnsAndFiltersSelectionBrowserPage.PARENT_ATTRIBUTE_ELEMENTS,
            ColumnsAndFiltersSelectionBrowserPage.CHILD_ATTRIBUTE_ELEMENT,
            attribute_name
        )

    def _ensure_attribute_is_selected(self, attribute_element):
        if not attribute_element.check_if_child_element_exists_by_css(
                ColumnsAndFiltersSelectionBrowserPage.CHECKED_CHECKBOX_CLASS,
                timeout=SHORT_TIMEOUT):
            attribute_element.click()

    def _click_forms(self, attribute_element, form_names):
        if len(form_names) > 0:
            self._ensure_attributes_forms_are_expanded(attribute_element)

            for form_name in form_names:
                attribute_form_element = attribute_element.get_element_by_text_from_elements_list_by_css(
                    ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORMS,
                    form_name
                )

                attribute_form_element.move_to_and_click(offset_x=2, offset_y=2)

    def _ensure_attributes_forms_are_expanded(self, attribute_element):
        if attribute_element.check_if_child_element_exists_by_css(
                ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ARROW_COLLAPSED,
                timeout=SHORT_TIMEOUT):
            attribute_element.get_element_by_css(
                ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ARROW_COLLAPSED
            ).click()

        if not attribute_element.check_if_child_element_exists_by_css(
                ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ARROW_EXPANDED,
                timeout=SHORT_TIMEOUT):
            raise MstrException(f'Error while expanding attributes forms.')

    def select_element_by_number(self, object_type, object_number):
        self.focus_on_add_in_popup_frame()

        element = ColumnsAndFiltersSelectionBrowserPage.OBJECTS_TYPE_TO_OBJECTS_GROUP[object_type] % object_number

        self.get_element_by_css(element).click()

    def expand_attribute_form(self, object_number):
        self.focus_on_add_in_popup_frame()

        attribute_form_arrow = self.get_element_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ARROW_COLLAPSED_ELEMENT_AT % object_number)

        attribute_form_arrow.click()

    def collapse_attribute_form(self, object_number):
        self.focus_on_add_in_popup_frame()

        attribute_form_arrow = self.get_element_by_css(
            ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_ARROW_EXPANDED_ELEMENT_AT % object_number)

        attribute_form_arrow.click()

    def get_attribute_form_name(self, attribute_form_number, attribute_number):
        self.focus_on_add_in_popup_frame()

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

    def get_sort_column_name(self, selector):
        return self._get_object_name(selector)

    def _get_object_name(self, object_selector):
        self.focus_on_add_in_popup_frame()

        name_input = self.get_element_by_css(object_selector)

        return name_input.text

    def sort_elements_ascending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionBrowserPage.SORT_ASCENDING)

    def sort_elements_descending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionBrowserPage.SORT_DESCENDING)

    def sort_elements_default_by_click(self, object_type):
        self._sort_elements_by_click(object_type, None)

    def _sort_elements_by_click(self, object_type, sorting_type):
        self.focus_on_add_in_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionBrowserPage.OBJECTS_TYPE_TO_TITLE_GROUP[object_type]
        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionBrowserPage.TRY_LIMIT_FOR_SORT):
            aria_value = sort_element.get_attribute(ColumnsAndFiltersSelectionBrowserPage.ARIA_SORT)

            if aria_value == sorting_type:
                return

            sort_element.click()

        raise MstrException('Click limit is reached. Selector could not be found')

    def search_for_element(self, element_name):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.send_keys_with_check(element_name)

    def clear_search_element(self):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.clear()

    def clear_element_search_with_backspace(self):
        self.focus_on_add_in_popup_frame()

        search_box = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.SEARCH_INPUT)
        search_box.click()

        while search_box.get_attribute("value") != '':
            self.press_right_arrow()
            self.press_backspace()

    def press_tab_until_object_type_focused(self, object_type):
        self.focus_on_add_in_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionBrowserPage.OBJECTS_TYPE_TO_TITLE_GROUP[object_type]
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
        self.focus_on_add_in_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionBrowserPage.OBJECTS_TYPE_TO_TITLE_GROUP[object_type]
        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionBrowserPage.TRY_LIMIT_FOR_SORT_BY_KEYBOARD):
            aria_value = sort_element.get_attribute(ColumnsAndFiltersSelectionBrowserPage.ARIA_SORT)

            if aria_value == sorting_type:
                return

            self.press_enter()

        raise MstrException('Tab limit is reached. Element could not be found')

    def scroll_into_object_by_number(self, object_number, object_type):
        self.focus_on_add_in_popup_frame()

        element = ColumnsAndFiltersSelectionBrowserPage.OBJECTS_TYPE_TO_OBJECTS_GROUP[object_type] % object_number
        self.get_element_by_css_no_visibility_checked(element).move_to()

    def click_import_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully(timeout=LONG_TIMEOUT)

    def click_import_button_to_duplicate(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_tile_browser_page.wait_for_duplicate_object_to_finish_successfully(timeout=LONG_TIMEOUT)

    def click_back_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.BACK_BUTTON_ELEM).click()

    def click_cancel_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ColumnsAndFiltersSelectionBrowserPage.CANCEL_BUTTON_ELEM).click()

    def close_popup_window(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.CLOSE_POPUP).click()

    def hover_over_first_filter(self):
        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.FIRST_FILTER).move_to()

    def select_first_filter(self):
        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.FIRST_FILTER).click()

    def get_background_color_of_first_filter(self):
        element = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.FIRST_FILTER)

        return element.get_background_color()

    def select_first_display_attributes_form_names_element(self):
        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROPDOWN).click()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM).click()

    def get_background_color_of_first_attribute_form_names_element(self):
        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROPDOWN).click()

        element = self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM)

        return element.get_background_color()

    def click_include_totals_and_subtotals(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ColumnsAndFiltersSelectionBrowserPage.TOTALS_AND_SUBTOTALS_SWITCH).click()
