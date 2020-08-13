from framework.pages_base.base_browser_page import BaseBrowserPage


class RightPanelTileDetailsBrowserPage(BaseBrowserPage):
    TOGGLE_DETAILS_BUTTONS = '.toggle-show-details-button'

    TOGGLE_DETAILS_TOOLTIPS = '.__react_component_tooltip.show.place-bottom.type-dark'

    def hover_over_toggle_details_button(self, object_number):
        self.focus_on_add_in_frame()

        toggle_details_buttons = self.get_elements_by_css(RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_BUTTONS)

        toggle_details_buttons[int(object_number) - 1].move_to()

    def get_toggle_details_tooltip_text(self, object_number):
        self.focus_on_add_in_frame()

        toggle_details_tooltips = self.get_elements_by_css(
            RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_BUTTONS
            + ' > '
            + RightPanelTileDetailsBrowserPage.TOGGLE_DETAILS_TOOLTIPS)

        return toggle_details_tooltips[int(object_number) - 1].text
