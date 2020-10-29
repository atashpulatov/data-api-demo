from framework.pages_base.base_browser_page import BaseBrowserPage


class ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage(BaseBrowserPage):
    TRIANGLE_IMAGE_XPATH = "//Image/Image/Image"

    SORT_ASCENDING = "icon_sort_triangle_up_blue"
    SORT_DESCENDING = "icon_sort_triangle_bottom_blue"
    SORT_DEFAULT = "icon_sort_triangle_gray"

    SORT_ATTRIBUTES = "sort-toggle-attributes"
    SORT_METRICS = "sort-toggle-metrics"
    SORT_FILTERS = "sort-toggle-filters"

    ATTRIBUTES = 'attributes'
    METRICS = 'metrics'
    FILTERS = 'filters'

    SORT_ELEMENT_OFFSET = 100

    AUTOMATION_ID = "AutomationId"

    OBJECTS_TYPE_TO_ELEMENT_NAME = {
        ATTRIBUTES: SORT_ATTRIBUTES,
        METRICS: SORT_METRICS,
        FILTERS: SORT_FILTERS
    }

    TOGGLE_ORDER = [SORT_DEFAULT, SORT_ASCENDING, SORT_DESCENDING]

    def sort_elements_ascending_by_click(self, object_type):
        self._toggle_sort_elements(
            object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING, "click")

    def sort_elements_descending_by_click(self, object_type):
        self._toggle_sort_elements(
            object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING, "click")

    def sort_elements_default_by_click(self, object_type):
        self._toggle_sort_elements(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DEFAULT, "click")

    def press_tab_until_object_type_focused(self, object_type):
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_ELEMENT_NAME[
            object_type]

        sort_element = self.get_element_by_name(object_type_sort_element, image_name=object_type_sort_element)

        offset_x = sort_element.size['width'] + ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ELEMENT_OFFSET
        # Click slightly to the right of the sort element so focus is set but no click event is registered
        # offset_y is 10 to workaround a selenium bug where the click wasn't occurring where expected
        sort_element.click(offset_x=offset_x, offset_y=10)

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
        Cycle through sort element states until the final_sort_type is found.
        :param object_type The type of the column to sort
        :param final_sort_type The sort type by which the column should be sorted
        :param event_to_trigger The event to be triggered to execute one step in the cycle
        """
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_ELEMENT_NAME[
            object_type]

        sort_element = self.get_element_by_name(object_type_sort_element)

        triangle = sort_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRIANGLE_IMAGE_XPATH)

        states = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TOGGLE_ORDER

        current_state = triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID)

        current_state_position = states.index(current_state)

        final_state_position = states.index(final_sort_type)

        number_of_states = len(states)

        if isinstance(event_to_trigger, str):
            trigger = getattr(sort_element, event_to_trigger)
        elif callable(event_to_trigger):
            trigger = event_to_trigger
        else:
            raise MstrException('Invalid usage of _toggle_sort_elements, event_to_trigger must be a string or callable')

        for i in range(0, number_of_states):
            if current_state_position is not final_state_position:
                trigger()
                current_state_position = (current_state_position + 1) % number_of_states  # eg. 0, 1, 2, 0, 1, 2...
            else:
                return

        raise MstrException('sort toggle states length limit is reached. Element not found')