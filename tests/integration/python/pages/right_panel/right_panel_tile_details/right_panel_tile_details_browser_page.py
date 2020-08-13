from framework.pages_base.base_browser_page import BaseBrowserPage


class RightPanelTileDetailsBrowserPage(BaseBrowserPage):
    SHOW_DETAILS_BUTTONS = '.toggle-show-details-button'

    def hover_over_show_details_button(self, object_number):
        self.focus_on_add_in_frame()

        show_details_buttons = self.get_elements_by_css(RightPanelTileDetailsBrowserPage.SHOW_DETAILS_BUTTONS)

        show_details_buttons[int(object_number) - 1].move_to()
