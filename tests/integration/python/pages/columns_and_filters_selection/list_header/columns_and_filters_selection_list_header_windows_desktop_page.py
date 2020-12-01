from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage(BaseWindowsDesktopPage):
    TRIANGLE_IMAGE_XPATH = '//Image/Image/Image'

    SORT_ASCENDING = 'icon_sort_triangle_up_blue'
    SORT_DESCENDING = 'icon_sort_triangle_bottom_blue'
    SORT_DEFAULT = 'icon_sort_triangle_gray'

    SORT_ATTRIBUTES = 'sort-toggle-attributes'
    SORT_METRICS = 'sort-toggle-metrics'
    SORT_FILTERS = 'sort-toggle-filters'

    ATTRIBUTES = 'attributes'
    METRICS = 'metrics'
    FILTERS = 'filters'

    SORT_ELEMENT_OFFSET_X = 100
    SORT_ELEMENT_OFFSET_Y = 10

    AUTOMATION_ID = 'AutomationId'

    OBJECTS_TYPE_TO_ELEMENT_NAME = {
        ATTRIBUTES: SORT_ATTRIBUTES,
        METRICS: SORT_METRICS,
        FILTERS: SORT_FILTERS
    }

    SORT_TOGGLE_ORDER_SELECTORS = [SORT_DEFAULT, SORT_ASCENDING, SORT_DESCENDING]

    EVENT_CLICK = 'click'

    COLUMN_NAME = '//Group/Button[@Name="%s"]/Text'

    SORT_ASCENDING = 'icon_sort_triangle_up_blue'
    SORT_DESCENDING = 'icon_sort_triangle_bottom_blue'
    SORT_DEFAULT = 'icon_sort_triangle_gray'

    def get_column_title(self, item_type):
        """
        Gets title of a column for a given item type.

        :param item_type: Type of item ('metrics', 'attributes' or 'filters').

        :return: Title of column.
        """

        if item_type not in ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_ELEMENT_NAME:
            raise MstrException(f'Wrong item_type [{item_type}] argument passed to ensure_item_selection')

        sort_title_name = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_ELEMENT_NAME[item_type]

        column_name = self.get_add_in_main_element().get_element_by_xpath(
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.COLUMN_NAME % sort_title_name
        ).text

        return column_name

    def sort_elements_ascending_by_click(self, object_type):
        self._toggle_sort_elements(
            object_type,
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING,
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.EVENT_CLICK
        )

    def sort_elements_descending_by_click(self, object_type):
        self._toggle_sort_elements(
            object_type,
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING,
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.EVENT_CLICK
        )

    def sort_elements_default_by_click(self, object_type):
        self._toggle_sort_elements(
            object_type,
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DEFAULT,
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.EVENT_CLICK
        )

    def press_tab_until_object_type_focused(self, object_type):
        sort_element = self._get_sort_element(object_type)

        offset_x = (
                sort_element.size['width'] +
                ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ELEMENT_OFFSET_X
        )

        # Click slightly to the right of the sort element so focus is set but no click event is registered,
        # offset_y is 10 to workaround a selenium bug where the click wasn't occurring where expected.
        sort_element.click(
            offset_x=offset_x,
            offset_y=ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ELEMENT_OFFSET_Y
        )

        self.press_tab()

    def press_enter_to_sort_element_ascending(self, object_type):
        self._toggle_sort_elements(
            object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING, self.press_enter)

    def press_enter_to_sort_element_descending(self, object_type):
        self._toggle_sort_elements(
            object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING, self.press_enter)

    def press_enter_to_sort_element_default(self, object_type):
        self._toggle_sort_elements(
            object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DEFAULT, self.press_enter)

    def _toggle_sort_elements(self, object_type, final_sort_type, event_to_trigger):
        """
        Cycles through sort element states until the final_sort_type is found.

        :param object_type The type of the column to sort.
        :param final_sort_type The sort type by which the column should be sorted.
        :param event_to_trigger The event to be triggered to execute one step in the cycle.
        """
        sort_element = self._get_sort_element(object_type)

        triangle = sort_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRIANGLE_IMAGE_XPATH
        )

        states = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_TOGGLE_ORDER_SELECTORS
        number_of_states = len(states)

        current_state = triangle.get_automation_id_by_attribute()

        current_state_position = states.index(current_state)
        final_state_position = states.index(final_sort_type)

        trigger = self._prepare_trigger(sort_element, event_to_trigger)

        for i in range(number_of_states):
            if current_state_position is not final_state_position:
                trigger()
                current_state_position = (current_state_position + 1) % number_of_states  # e.g. 0, 1, 2, 0, 1, 2...
            else:
                return

        raise MstrException(f'Element not found, sort toggle states length limit [{number_of_states}] is reached, '
                            f'object_type: [{object_type}], final_sort_type: [{final_sort_type}], '
                            f'event_to_trigger: [{event_to_trigger}].')

    def _get_sort_element(self, object_type):
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_ELEMENT_NAME[
            object_type]

        return self.get_element_by_name(object_type_sort_element)

    def _prepare_trigger(self, sort_element, event_to_trigger):
        if isinstance(event_to_trigger, str) and hasattr(sort_element, event_to_trigger):
            return getattr(sort_element, event_to_trigger)
        elif callable(event_to_trigger):
            return event_to_trigger

        raise MstrException(f'Invalid usage of _toggle_sort_elements(), event_to_trigger must be a string '
                            f'representing sort element attribute or be a callable, was: [{event_to_trigger}].')
