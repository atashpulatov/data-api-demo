from framework.pages_base.base_browser_page import BaseBrowserPage


class RightPanelTileDetailsBrowserPage(BaseBrowserPage):
    TOGGLE_DETAILS_BUTTONS = '.toggle-show-details-button'
    TOGGLE_DETAILS_TOOLTIPS = TOGGLE_DETAILS_BUTTONS + ' > .__react_component_tooltip.show.place-bottom.type-dark'

    PROMPTS_LIST = 'div[id^="prompts-list-"]'
    FILTERS_LIST = 'div[id^="filters-list-"]'
    ATTRIBUTES_LIST = 'div[id^="attributes-list-"]'
    METRICS_LIST = 'div[id^="metrics-list-"]'
    NAME_LISTS = (
        PROMPTS_LIST,
        FILTERS_LIST,
        ATTRIBUTES_LIST,
        METRICS_LIST
    )
    NAME_LIST_EXPAND_BUTTON = '.name-list-expand-button'

    def _get_name_list_expand_button_selector(self, name_list_index):
        selector = RightPanelTileDetailsBrowserPage.NAME_LISTS[name_list_index] + ' ' \
           + RightPanelTileDetailsBrowserPage.NAME_LIST_EXPAND_BUTTON

        return selector

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

    def click_name_list_expand_button(self, object_number, name_list_index):
        self.focus_on_add_in_frame()

        name_list_expand_buttons = self.get_elements_by_css(
            self._get_name_list_expand_button_selector(name_list_index)
        )

        print(self._get_name_list_expand_button_selector(name_list_index))

        name_list_expand_buttons[int(object_number) - 1].click()
