from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException
from pages.right_panel.right_panel_main.right_panel_main_windows_desktop_page import RightPanelMainWindowsDesktopPage


class RightPanelTileWindowsDesktopPage(BaseWindowsDesktopPage):
    DUPLICATE_BUTTON_ELEM = 'Duplicate button'
    EDIT_BUTTON_ELEM = 'Edit button'

    RIGHT_PANEL_ELEM = 'MicroStrategy for Office'
    OBJECT_NAME_ELEM = '//DataItem[%s]/Group/Button/Text'

    def close_all_notifications_on_hover(self):
        elements = self.get_elements_by_name(RightPanelTileWindowsDesktopPage.DUPLICATE_BUTTON_ELEM)

        for element in elements:
            element.move_to()

    def close_last_notification_on_hover(self):
        elements = self.get_elements_by_name(RightPanelTileWindowsDesktopPage.DUPLICATE_BUTTON_ELEM)

        if elements:
            other_element = self.get_element_by_name(
                RightPanelMainWindowsDesktopPage.MICROSTRATEGY_LOG_ELEM,
                image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.MICROSTRATEGY_LOG_ELEM)
            )
            other_element.move_to()

            elements[0].move_to()

    def click_duplicate(self, tile_no):
        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.DUPLICATE_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def click_edit(self, tile_no):
        self._click_button_on_tile(RightPanelTileWindowsDesktopPage.EDIT_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def _click_button_on_tile(self, button_selector, tile_no):
        """
        Clicks button given by selector on tile number object_no.
        :param button_selector: Button selector.
        :param tile_no: Number of tile, counting from 1.
        """
        elements = self.get_elements_by_name(button_selector)

        object_index = int(tile_no) - 1

        if object_index > len(elements):
            raise MstrException(('Not possible to click tile, given object index is too big', object_index, elements))

        found_element = elements[object_index]

        # Workaround - move mouse a little to gain focus
        found_element.move_to(10, 10)
        found_element.move_to(-10, -10)

        found_element.click()

    def get_object_name(self, index):
        right_panel_element = self.get_element_by_name(RightPanelTileWindowsDesktopPage.RIGHT_PANEL_ELEM)

        object_name_element = right_panel_element.get_element_by_xpath(
            RightPanelTileWindowsDesktopPage.OBJECT_NAME_ELEM % index
        )

        return object_name_element.get_name_by_attribute()
