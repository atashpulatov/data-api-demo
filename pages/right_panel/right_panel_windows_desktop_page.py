from pages.base_windows_desktop_page import BaseWindowsDesktopPage


class RightPanelWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_DATA_BUTTON_ELEM = 'Import Data button'
    DUPLICATE_BUTTON_ELEM = 'Duplicate button'
    EDIT_BUTTON_ELEM = 'Edit button'

    RIGHT_PANEL_ELEM = 'MicroStrategy for Office'
    OBJECT_NAME_ELEM = '//Button/List/DataItem[%s]/Group/Button[5]/Text'

    def click_import_data_button_element(self):
        self.click_element_by_name(RightPanelWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM,
                                   image_name=self.prepare_image_name(
                                       RightPanelWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM))

    def close_all_notifications_on_hover(self):
        elements = self.get_visible_elements_by_name(RightPanelWindowsDesktopPage.DUPLICATE_BUTTON_ELEM)

        for element in elements:
            self.move_to_element(element)

    def click_duplicate(self, tile_no):
        self._click_button_on_tile(RightPanelWindowsDesktopPage.DUPLICATE_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def click_edit(self, tile_no):
        self._click_button_on_tile(RightPanelWindowsDesktopPage.EDIT_BUTTON_ELEM, tile_no)

        self.pause(3)  # TODO check visibility

    def _click_button_on_tile(self, button_selector, tile_no):
        """
        Clicks button given by selector on tile number object_no.
        :param button_selector: Button selector.
        :param tile_no: Number of tile, counting from 1.
        """
        # plugin_element = self.get_visible_element_by_name(RightPanelWindowsDesktopPage.RIGHT_PANEL_ELEM)
        # self.move_to_element(plugin_element)

        elements = self.get_visible_elements_by_name(button_selector)

        object_index = int(tile_no) - 1

        if object_index > len(elements):
            raise Exception(('Not possible to click tile, given object index too big', object_index, elements))

        found_element = elements[object_index]

        # Workaround - move mouse a little to gain focus
        self.move_to_element(found_element, 10, 10)
        self.move_to_element(found_element, -10, -10)

        self.click_element_simple(found_element)

    def get_object_name(self, index):
        plugin_element = self.get_visible_element_by_name(RightPanelWindowsDesktopPage.RIGHT_PANEL_ELEM)

        object_name_element = plugin_element.find_element_by_xpath(
            RightPanelWindowsDesktopPage.OBJECT_NAME_ELEM % index
        )

        return self.get_element_name(object_name_element)

    def logout(self):
        pass
