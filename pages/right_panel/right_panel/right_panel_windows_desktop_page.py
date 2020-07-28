from pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from pages_base.windows_desktop_workaround import WindowsDesktopWorkaround


class RightPanelWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_DATA_BUTTON_ELEM = 'Import Data button'
    ADD_DATA_BUTTON_ELEM = 'Add Data'

    def __init__(self):
        super().__init__()

        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def click_import_data_button_element(self):
        self.windows_desktop_workaround.focus_on_right_side_panel()

        self.get_element_by_name(
            RightPanelWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(RightPanelWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM)
        ).click()

    def click_add_data_button_element(self):
        self.windows_desktop_workaround.focus_on_right_side_panel()

        self.get_element_by_name(
            RightPanelWindowsDesktopPage.ADD_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(RightPanelWindowsDesktopPage.ADD_DATA_BUTTON_ELEM)
        ).click()

    def logout(self):
        pass
