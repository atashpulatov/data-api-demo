from framework.pages_base.base_browser_page import BaseBrowserPage


class ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage(BaseBrowserPage):

    SORT_ASCENDING = "icon_sort_triangle_up_blue"

    SORT_DESCENDING = "icon_sort_triangle_bottom_blue"

    SORT_DEFAULT = "icon_sort_triangle_gray"

    TRIANGLE_IMAGE_XPATH = "//Image/Image/Image"

    TRY_LIMIT_FOR_SORT = 3

    TRY_LIMIT_FOR_SORT_BY_KEYBOARD = 6

    SORT_ATTRIBUTES = "sort-toggle-attributes"

    SORT_METRICS = "sort-toggle-metrics"

    SORT_FILTERS = "sort-toggle-filters"

    ATTRIBUTES = 'attributes'
    METRICS = 'metrics'
    FILTERS = 'filters'

    AUTOMATION_ID = "AutomationId"

    OBJECTS_TYPE_TO_AUTOMATION_ID_GROUP = {
        ATTRIBUTES: SORT_ATTRIBUTES,
        METRICS: SORT_METRICS,
        FILTERS: SORT_FILTERS
    }

    TOGGLE_ORDER = [SORT_DEFAULT, SORT_ASCENDING, SORT_DESCENDING]

    def _toggle_sort_elements(self, object_type, final_sort_type, event_to_trigger):
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_AUTOMATION_ID_GROUP[
            object_type]

        sort_element = self.get_element_by_name(object_type_sort_element, image_name=object_type_sort_element)

        triangle = sort_element.get_element_by_xpath(
            ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRIANGLE_IMAGE_XPATH)

        states = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TOGGLE_ORDER

        current_state = triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID)

        current_state_position = states.index(current_state)

        final_state_position = states.index(final_sort_type)

        number_of_states = len(states)

        for i in range(0, number_of_states):
          if current_state_position is not final_state_position:
              getattr(sort_element, event_to_trigger)()
              current_state_position = (current_state_position + 1) % number_of_states
          else:
            return

        raise MstrException('sort toggle states length limit is reached. Element not found')

    def sort_elements_ascending_by_click(self, object_type):
        self._toggle_sort_elements(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING, "click")

    def sort_elements_descending_by_click(self, object_type):
        self._toggle_sort_elements(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING, "click")

    def sort_elements_default_by_click(self, object_type):
        self._toggle_sort_elements(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DEFAULT, "click")

    def press_tab_until_object_type_focused(self, object_type):

        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]

        sort_element = self.get_element_by_name(object_type_sort_element, image_name=object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRY_LIMIT_FOR_SORT_BY_KEYBOARD):
            if sort_element == self.get_element_with_focus():
                return

            self.press_tab()

        raise MstrException('Tab limit is reached. Element not found')

    def press_enter_to_sort_element_ascending(self, object_type):
        self._toggle_sort_elements(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING, "press_enter")

        # Otherwise, we are already in ascending state
    def press_enter_to_sort_element_descending(self, object_type):
        self._toggle_sort_elements(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING, "press_enter")

    def press_enter_to_sort_element_default(self, object_type):
        self._toggle_sort_elements(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DEFAULT, "press_enter")
