from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround


class ImportDossierShowDataWindowsDesktopPage(BaseWindowsDesktopPage):
    CLOSE_SHOW_DATA_BUTTON = 'Close'

    def __init__(self):
        super().__init__()

        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def close_show_data(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        add_in_main_element = self.get_add_in_main_element()
        add_in_main_element.get_element_by_name(ImportDossierShowDataWindowsDesktopPage.CLOSE_SHOW_DATA_BUTTON).click()
