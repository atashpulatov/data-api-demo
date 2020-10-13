from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionListHeaderBrowserPage(BaseBrowserPage):
    ROOT_ATTRIBUTE_CONTAINER = '.attributes-col'
    ATTRIBUTES_TITLE_SORT = ROOT_ATTRIBUTE_CONTAINER + ' > div > .selector-title > div'

    ROOT_METRIC_CONTAINER = '.metrics-col'
    METRICS_TITLE_SORT = ROOT_METRIC_CONTAINER + ' > div > .selector-title > div'

    ROOT_FILTER_CONTAINER = '.filters-col > div > div:nth-child(1)'
    FILTERS_TITLE_SORT = ROOT_FILTER_CONTAINER + ' > .filter-selector-title > div'

    ARIA_SORT = 'aria-sort'
    SORT_ASCENDING = 'ascending'
    SORT_DESCENDING = 'descending'

    ATTRIBUTES_SORT_TITLE = '.attributes-col .sort-title-section'
    METRICS_SORT_TITLE = '.metrics-col .sort-title-section'
    FILTER_SORT_TITLE = '.filters-col .sort-title-section'

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

    def ensure_item_selection(self, item_type, number, of_number):
        """
        Ensures proper number of given item type is selected.

        :param item_type: type of item (metrics / attributes / filters)
        :param number: number of selected items
        :param of_number: number of all items
        """

        if item_type not in ColumnsAndFiltersSelectionListHeaderBrowserPage.OBJECTS_TYPE_TO_OBJECTS_COLUMN_TITLE_GROUP:
            raise MstrException(f'Wrong item_type [{item_type}] argument passed to ensure_item_selection')

        self.focus_on_add_in_popup_frame()

        sort_title_selector = \
            ColumnsAndFiltersSelectionListHeaderBrowserPage.OBJECTS_TYPE_TO_OBJECTS_COLUMN_TITLE_GROUP[item_type]

        title = f'{item_type.upper()} ({number}/{of_number})'

        column_name = self.get_element_by_css(sort_title_selector).text

        if column_name == title:
            return

        raise MstrException(f'{item_type} selection does not match - selector: {column_name}, text: {title}.')

    def sort_elements_ascending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionListHeaderBrowserPage.SORT_ASCENDING)

    def sort_elements_descending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionListHeaderBrowserPage.SORT_DESCENDING)

    def sort_elements_default_by_click(self, object_type):
        self._sort_elements_by_click(object_type, None)

    def _sort_elements_by_click(self, object_type, sorting_type):
        self.focus_on_add_in_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderBrowserPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]
        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionListHeaderBrowserPage.TRY_LIMIT_FOR_SORT):
            aria_value = sort_element.get_attribute(ColumnsAndFiltersSelectionListHeaderBrowserPage.ARIA_SORT)

            if aria_value == sorting_type:
                return

            sort_element.click()

        raise MstrException('Click limit is reached. Selector could not be found')

    def press_tab_until_object_type_focused(self, object_type):
        self.focus_on_add_in_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderBrowserPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]

        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionListHeaderBrowserPage.TRY_LIMIT_FOR_SORT_BY_KEYBOARD):
            if sort_element == self.get_element_with_focus():
                return

            self.press_tab()

        raise MstrException('Tab limit is reached. Element not found')

    def press_enter_to_sort_element_ascending(self, object_type):
        self._sort_elements_by_keyboard(object_type, ColumnsAndFiltersSelectionListHeaderBrowserPage.SORT_ASCENDING)

    def press_enter_to_sort_element_descending(self, object_type):
        self._sort_elements_by_keyboard(object_type, ColumnsAndFiltersSelectionListHeaderBrowserPage.SORT_DESCENDING)

    def press_enter_to_sort_element_default(self, object_type):
        self._sort_elements_by_keyboard(object_type, None)

    def _sort_elements_by_keyboard(self, object_type, sorting_type):
        self.focus_on_add_in_popup_frame()

        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderBrowserPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]

        sort_element = self.get_element_by_css(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionListHeaderBrowserPage.TRY_LIMIT_FOR_SORT_BY_KEYBOARD):
            aria_value = sort_element.get_attribute(ColumnsAndFiltersSelectionListHeaderBrowserPage.ARIA_SORT)

            if aria_value == sorting_type:
                return

            self.press_enter()

        raise MstrException('Tab limit is reached. Element could not be found')
