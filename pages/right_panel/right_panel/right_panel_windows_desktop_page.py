from pages.base_windows_desktop_page import BaseWindowsDesktopPage


class RightPanelWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_DATA_BUTTON_ELEM = 'Import Data button'
    ADD_DATA_BUTTON_ELEM = 'Add Data'

    def click_import_data_button_element(self):
        self.get_element_by_name(
            RightPanelWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(RightPanelWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM)
        ).click()

    def click_add_data_button_element(self):
        self.get_element_by_name(
            RightPanelWindowsDesktopPage.ADD_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(RightPanelWindowsDesktopPage.ADD_DATA_BUTTON_ELEM)
        ).click()

    def logout(self):
        pass
