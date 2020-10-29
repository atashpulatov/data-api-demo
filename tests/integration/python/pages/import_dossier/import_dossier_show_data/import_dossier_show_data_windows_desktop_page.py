from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround


class ImportDossierShowDataWindowsDesktopPage(BaseWindowsDesktopPage):
    SHOW_DATA_WINDOW = '//Group[contains(@Name, "Show Data")]/Table[position()>1]'
    CLOSE_SHOW_DATA_BUTTON = 'Close'

    def __init__(self):
        super().__init__()

        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def close_show_data(self):
        self.windows_desktop_workaround.focus_on_popup_window()

        self.get_element_by_name_using_parent(
            self.get_element_by_xpath, ImportDossierShowDataWindowsDesktopPage.SHOW_DATA_WINDOW,
            ImportDossierShowDataWindowsDesktopPage.CLOSE_SHOW_DATA_BUTTON,
            image_name=self.prepare_image_name(ImportDossierShowDataWindowsDesktopPage.CLOSE_SHOW_DATA_BUTTON)
        ).click()
