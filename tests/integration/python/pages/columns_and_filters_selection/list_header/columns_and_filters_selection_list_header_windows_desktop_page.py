from framework.pages_base.base_browser_page import BaseBrowserPage


class ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage(BaseBrowserPage):

  SORT_ASCENDING = "icon_sort_triangle_up_blue"

  SORT_DESCENDING = "icon_sort_triangle_up_blue"

  TRY_LIMIT_FOR_SORT = 3

  TRY_LIMIT_FOR_SORT_BY_KEYBOARD = 30

  SORT_ATTRIBUTES = "sort-toggle-attributes"

  SORT_METRICS = "sort-toggle-metrics"

  SORT_FILTERS = "sort-toggle-filters"

  OBJECTS_TYPE_TO_AUTOMATION_ID_GROUP = {
      ATTRIBUTES: SORT_ATTRIBUTES,
      METRICS: SORT_METRICS,
      FILTERS: SORT_FILTERS
  }


def sort_elements_ascending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING)

    def sort_elements_descending_by_click(self, object_type):
        self._sort_elements_by_click(object_type, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING)

    def sort_elements_default_by_click(self, object_type):
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_AUTOMATION_ID_GROUP[
            object_type]

        sort_element = self.get_element_by_accessibility_id(object_type_sort_element)

        # Check that the other sorting_type elements are not visible
        if self.get_element_by_accessibility_id(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING):
          sort_element.click()
          sort_element.click()
          return
        
        if self.get_element_by_accessibility_id(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING)
          sort_element.click()


    def _sort_elements_by_click(self, object_type, sorting_type):

        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_AUTOMATION_ID_GROUP[
            object_type]

        sort_element = self.get_element_by_accessibility_id(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.TRY_LIMIT_FOR_SORT):

          sorting_element_found = sort_element.get_element_by_accessibility_id(sorting_type)

          if sorting_element_found:
            return

          sort_element.click()

        raise MstrException('Click limit is reached. Selector could not be found')

    def press_tab_until_object_type_focused(self, object_type):

        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderBrowserPage.OBJECTS_TYPE_TO_TITLE_GROUP[
            object_type]

        sort_element = self.get_element_by_accessibility_id(object_type_sort_element)

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
        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_AUTOMATION_ID_GROUP[object_type]

        sort_element = self.get_element_by_accessibility_id(object_type_sort_element)

        # Check that the other sorting_type elements are not visible
        if self.get_element_by_accessibility_id(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_ASCENDING):
          sort_element.press_enter()
          sort_element.press_enter()
          return
        
        if self.get_element_by_accessibility_id(ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.SORT_DESCENDING)
          sort_element.press_enter()
    
    def _sort_elements_by_keyboard(self, object_type, sorting_type):

        object_type_sort_element = ColumnsAndFiltersSelectionListHeaderWindowsDesktopPage.OBJECTS_TYPE_TO_AUTOMATION_ID_GROUP[
            object_type]

        sort_element = self.get_element_by_accessibility_id(object_type_sort_element)

        for i in range(0, ColumnsAndFiltersSelectionListHeaderBrowserPage.TRY_LIMIT_FOR_SORT_BY_KEYBOARD):
            sorting_element_found = sort_element.get_element_by_accessibility_id(sorting_type)

            if sorting_element_found:
              return

          sort_element.press_enter()

        raise MstrException('Tab limit is reached. Element could not be found')
