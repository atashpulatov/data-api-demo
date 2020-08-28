from framework.pages_base.base_browser_page import BaseBrowserPage

from framework.util.assert_util import AssertUtil


class RightPanelTileDetailsBrowserPage(BaseBrowserPage):
    TILE_DETAILS_CONTAINER = 'div[id^="object-details-panel-container-"]'

    TOGGLE_DETAILS_BUTTONS = '.toggle-show-details-button'
    TOGGLE_DETAILS_TOOLTIPS = TOGGLE_DETAILS_BUTTONS + ' > .__react_component_tooltip.show.place-bottom.type-dark'

    PROMPTS_LIST = 'div[id^="prompts-list-"]'
    FILTERS_LIST = 'div[id^="filters-list-"]'
    ATTRIBUTES_LIST = 'div[id^="attributes-list-"]'
    METRICS_LIST = 'div[id^="metrics-list-"]'
    NAME_LISTS = {
        "PROMPT": PROMPTS_LIST,
        "FILTER": FILTERS_LIST,
        "ATTRIBUTE": ATTRIBUTES_LIST,
        "METRIC": METRICS_LIST
    }
    NAME_LIST_EXPAND_BUTTON = '.name-list-expand-button'
    OBJECT_LOCATION_EXPAND_BUTTON = '.object-location-expand-button'

    CERTIFIED = 'div[id^="certified-object-property-"]'
    OBJECT_ID_CONTAINER = 'div[id^="id-object-property-"]'
    OBJECT_OWNER_CONTAINER = 'div[id^="owner-object-property-"]'
    OBJECT_PROPERTY_VALUE = '.object-property-value'
    OBJECT_ID_VALUE = OBJECT_ID_CONTAINER + ' > ' + OBJECT_PROPERTY_VALUE
    OBJECT_OWNER_VALUE = OBJECT_OWNER_CONTAINER + ' > ' + OBJECT_PROPERTY_VALUE

    def _get_name_list_expand_button_selector(self, name_list_type):
        selector = RightPanelTileDetailsBrowserPage.NAME_LISTS[name_list_type] + ' ' \
           + RightPanelTileDetailsBrowserPage.NAME_LIST_EXPAND_BUTTON

        return selector

    def _get_tile_details_container(self, object_number):
        return self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TILE_DETAILS_CONTAINER)[int(object_number) - 1]

    def click_toggle_details_button(self, object_number):
        self.focus_on_add_in_frame()

        toggle_details_buttons = self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_BUTTONS)

        toggle_details_buttons[int(object_number) - 1].click()

    def hover_over_toggle_details_button(self, object_number):
        self.focus_on_add_in_frame()

        toggle_details_buttons = self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_BUTTONS)

        toggle_details_buttons[int(object_number) - 1].move_to()

    def get_toggle_details_tooltip_text(self, object_number):
        self.focus_on_add_in_frame()

        toggle_details_tooltips = self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_TOOLTIPS)

        return toggle_details_tooltips[int(object_number) - 1].text

    def click_name_list_expand_button(self, object_number, name_list_type):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        name_list_expand_button = tile_details_container.get_element_by_css(
            self._get_name_list_expand_button_selector(name_list_type)
        )

        name_list_expand_button.click()

    def click_object_location_expand_button(self, object_number):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        object_location_expand_button = tile_details_container.get_element_by_css(
            RightPanelTileDetailsBrowserPage.OBJECT_LOCATION_EXPAND_BUTTON
        )

        object_location_expand_button.click()

    def check_if_object_is_certified(self, object_number):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        return tile_details_container.check_if_child_element_exists_by_css(RightPanelTileDetailsBrowserPage.CERTIFIED)

    def check_if_name_list_exists_on_object(self, object_number, name_list_type):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        name_list_exists = tile_details_container.check_if_child_element_exists_by_css(
            RightPanelTileDetailsBrowserPage.NAME_LISTS[name_list_type]
        )
        AssertUtil.assert_simple(name_list_exists, True)

    def get_object_list_property_value(self, object_number, property_name):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)
        css_selector = getattr(self, property_name)
        return tile_details_container.get_element_by_css(css_selector).text

    def check_if_object_id_is_correct(self, object_number, object_id):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        tested_object_id = tile_details_container.get_element_by_css(
            RightPanelTileDetailsBrowserPage.OBJECT_ID_VALUE
        ).text

        AssertUtil.assert_simple(tested_object_id, object_id)

    def check_if_object_owner_is_correct(self, object_number, owner):
        self.focus_on_add_in_frame()

        tile_details_container = self._get_tile_details_container(object_number)

        tested_object_owner = tile_details_container.get_element_by_css(
            RightPanelTileDetailsBrowserPage.OBJECT_OWNER_VALUE
        ).text

        AssertUtil.assert_simple(tested_object_owner, owner)
