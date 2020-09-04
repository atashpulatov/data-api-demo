from framework.pages_base.base_browser_page import BaseBrowserPage


class RightPanelTileDetailsBrowserPage(BaseBrowserPage):
    TILE_DETAILS_CONTAINER = 'div[id^="object-details-panel-container-"]'
    OBJECT_DETAILS_PANEL = '.object-details-panel'

    TOGGLE_DETAILS_BUTTONS = '.toggle-show-details-button'
    TOGGLE_DETAILS_TOOLTIPS = TOGGLE_DETAILS_BUTTONS + ' > .__react_component_tooltip.show.place-bottom.type-dark'

    PROMPTS_LIST = 'div[id^="prompts-list-"]'
    FILTERS_LIST = 'div[id^="filters-list-"]'
    ATTRIBUTES_LIST = 'div[id^="attributes-list-"]'
    METRICS_LIST = 'div[id^="metrics-list-"]'

    NAME_LISTS_TO_SELECTOR = {
        'Prompt': PROMPTS_LIST,
        'Filter': FILTERS_LIST,
        'Attribute': ATTRIBUTES_LIST,
        'Metric': METRICS_LIST
    }
    NAME_LIST_EXPAND_BUTTON = '.name-list-expand-button'
    OBJECT_LOCATION_EXPAND_BUTTON = '.object-location-expand-button'
    OBJECT_LOCATION = '.object-location'
    COLLAPSED = '.collapsed'

    CERTIFIED = 'div[id^="certified-object-property-"]'
    OBJECT_ID_CONTAINER = 'div[id^="id-object-property-"]'
    OBJECT_OWNER_CONTAINER = 'div[id^="owner-object-property-"]'
    OBJECT_TOTALS_AND_SUBTOTALS_CONTAINER = 'div[id^="subtotals-object-property-"]'
    OBJECT_PROPERTY_VALUE = '.object-property-value'
    OBJECT_ID_VALUE = OBJECT_ID_CONTAINER + ' > ' + OBJECT_PROPERTY_VALUE
    OBJECT_OWNER_VALUE = OBJECT_OWNER_CONTAINER + ' > ' + OBJECT_PROPERTY_VALUE
    OBJECT_TOTALS_AND_SUBTOTALS_VALUE = OBJECT_TOTALS_AND_SUBTOTALS_CONTAINER + ' > ' + OBJECT_PROPERTY_VALUE

    TOTALS_AND_SUBTOTALS_ON = 'ON'

    def click_toggle_details_button(self, object_number):
        self._get_toggle_details_button(object_number).click()

    def hover_over_toggle_details_button(self, object_number):
        self._get_toggle_details_button(object_number).move_to()

    def _get_toggle_details_button(self, object_number):
        self.focus_on_add_in_frame()

        object_index = int(object_number) - 1

        return self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_BUTTONS)[object_index]

    def click_name_list_expand_button(self, object_number, name_list_type):
        selector = RightPanelTileDetailsBrowserPage.NAME_LISTS_TO_SELECTOR[name_list_type] + ' ' \
                   + RightPanelTileDetailsBrowserPage.NAME_LIST_EXPAND_BUTTON

        self._click_expand_button(object_number, selector)

    def click_object_location_expand_button(self, object_number):
        self._click_expand_button(object_number, RightPanelTileDetailsBrowserPage.OBJECT_LOCATION_EXPAND_BUTTON)

    def _click_expand_button(self, object_number, selector):
        self.focus_on_add_in_frame()

        object_index = int(object_number) - 1

        tile_details_container = self._get_tile_details_container(object_index)

        tile_details_container.get_element_by_css(selector).click()

    def is_object_is_certified(self, object_number):
        return self._details_element_exists(
            object_number,
            RightPanelTileDetailsBrowserPage.CERTIFIED
        )

    def name_list_exists_on_object(self, object_number, name_list_type):
        return self._details_element_exists(
            object_number,
            RightPanelTileDetailsBrowserPage.NAME_LISTS_TO_SELECTOR[name_list_type]
        )

    def collapsed_name_list_exists_on_object(self, object_number, name_list_type):
        return self._details_element_exists(
            object_number,
            RightPanelTileDetailsBrowserPage.NAME_LISTS_TO_SELECTOR[
                name_list_type] + RightPanelTileDetailsBrowserPage.COLLAPSED
        )

    def collapsed_location_exists_on_object(self, object_number):
        return self._details_element_exists(
            object_number,
            RightPanelTileDetailsBrowserPage.OBJECT_LOCATION + RightPanelTileDetailsBrowserPage.COLLAPSED
        )

    def _details_element_exists(self, object_number, selector):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        return tile_details_container.check_if_child_element_exists_by_css(selector)

    def get_object_list_property_value(self, object_number, name_list_type):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        selector = RightPanelTileDetailsBrowserPage.NAME_LISTS_TO_SELECTOR[name_list_type]

        return tile_details_container.get_element_by_css(selector).text

    def is_details_panel_displayed_on_object(self, object_number):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        object_detail_panel = tile_details_container.get_elements_by_css(
            RightPanelTileDetailsBrowserPage.OBJECT_DETAILS_PANEL
        )

        return len(object_detail_panel) == 1

    def get_toggle_details_tooltip_text(self, object_number):
        self.focus_on_add_in_frame()

        object_index = int(object_number) - 1

        toggle_details_tooltips = self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_TOOLTIPS)

        return toggle_details_tooltips[object_index].text

    def get_object_id(self, object_number):
        return self._get_object_detail(object_number, RightPanelTileDetailsBrowserPage.OBJECT_ID_VALUE)

    def get_object_owner(self, object_number):
        return self._get_object_detail(object_number, RightPanelTileDetailsBrowserPage.OBJECT_OWNER_VALUE)

    def get_object_location(self, object_number):
        return self._get_object_detail(object_number, RightPanelTileDetailsBrowserPage.OBJECT_LOCATION)

    def _get_object_detail(self, object_number, selector):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        return tile_details_container.get_element_by_css(selector).text

    def _get_tile_details_container(self, object_number):
        object_index = int(object_number) - 1

        return self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TILE_DETAILS_CONTAINER)[object_index]

    def check_if_totals_and_subtotals_are_on(self, object_number):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)
        tested_object_totals_and_subtotals = tile_details_container.get_element_by_css(
            RightPanelTileDetailsBrowserPage.OBJECT_TOTALS_AND_SUBTOTALS_VALUE
        ).text

        return tested_object_totals_and_subtotals == RightPanelTileDetailsBrowserPage.TOTALS_AND_SUBTOTALS_ON
