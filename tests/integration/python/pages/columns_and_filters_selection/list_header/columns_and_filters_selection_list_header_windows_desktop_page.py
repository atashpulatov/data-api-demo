from framework.pages_base.base_browser_page import BaseBrowserPage


class ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage(BaseBrowserPage):

    SORT_ASCENDING = "icon_sort_triangle_up_blue"

    SORT_DESCENDING = "icon_sort_triangle_down_blue"

    SORT_DEFAULT = "icon_sort_triangle_gray"

    TRIANGLE_IMAGE_XPATH = "//Image/Image/Image"

    TRY_LIMIT_FOR_SORT = 3

    TRY_LIMIT_FOR_SORT_BY_KEYBOARD = 30

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

    def _sort_elements_ascending(self, object_type, event_to_trigger):
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]

        sort_element = self.get_element_by_name(object_type_sort_element, image_name=object_type_sort_element)

        triangles = sort_element.get_elements_by_xpath(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRIANGLE_IMAGE_XPATH)

        #only the element containing gray triangles exists, default state
        if(len(triangles) is 1):
            getattr(sort_element, event_to_trigger)()
        elif top_triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID) is SORT_DEFAULT and bottom_triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID) is SORT_DESCENDING:
            getattr(sort_element, event_to_trigger)()
            getattr(sort_element, event_to_trigger)()
            getattr(sort_element, event_to_trigger)()
        
        #Otherwise, we are already in ascending state

    def _sort_elements_descending(self, object_type):
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]

        sort_element = self.get_element_by_name(object_type_sort_element, image_name=object_type_sort_element)

        triangles = sort_element.get_elements_by_xpath(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRIANGLE_IMAGE_XPATH)

        #only the element containing gray triangles exists, default state
        if(len(triangles) is 1):
            getattr(sort_element, event_to_trigger)()
            getattr(sort_element, event_to_trigger)()
        elif top_triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID) is SORT_ASCENDING and bottom_triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID) is SORT_DEFAULT:
            getattr(sort_element, event_to_trigger)()
        
        #Otherwise, we are already in descending state

    def _sort_elements_default(self, object_type):
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]

        sort_element = self.get_element_by_name(object_type_sort_element, image_name=object_type_sort_element)

        triangles = sort_element.get_elements_by_xpath(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRIANGLE_IMAGE_XPATH)

        #only the element containing gray triangles exists, default state
        if(len(triangles) is 1):
            return
        elif top_triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID) is SORT_ASCENDING and bottom_triangle.get_attribute(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.AUTOMATION_ID) is SORT_DEFAULT:
            getattr(sort_element, event_to_trigger)()
            getattr(sort_element, event_to_trigger)()
        else:
            getattr(sort_element, event_to_trigger)()

    def sort_elements_ascending_by_click(self, object_type):
        self._sort_elements_ascending(object_type, "click")

    def sort_elements_descending_by_click(self, object_type):
        self._sort_elements_descending(object_type, "click")

    def sort_elements_default_by_click(self, object_type):
        self._sort_elements_default(self, "click")

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
        self._sort_elements_ascending(object_type, "press_enter")

        #Otherwise, we are already in ascending state
    def press_enter_to_sort_element_descending(self, object_type):
        self._sort_elements_descending(object_type, "press_enter")

    def press_enter_to_sort_element_default(self, object_type):
        self._sort_elements_default(object_type, "press_enter")

