from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround


class RightPanelMainWindowsDesktopPage(BaseWindowsDesktopPage):
    IMPORT_DATA_BUTTON_ELEM = 'Import Data button'
    ADD_DATA_BUTTON_ELEM = 'Add Data'

    MICROSTRATEGY_LOG_ELEM = 'microstrategy logo'

    DOTS_MENU_NAME = 'Settings'

    CLEAR_DATA = 'Clear Data'

    VIEW_DATA = "View Data button"

    CONFIRM_CLEAR_DATA_ACCESSIBILITY_ID = 'confirm-btn'

    LOGOUT_ACCESSIBILITY_ID = 'logOut'

    def __init__(self):
        super().__init__()

        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def click_import_data_button_element(self):
        WindowsDesktopMainAddInElementCache.invalidate_cache()

        self.windows_desktop_workaround.focus_on_right_side_panel()

        self.get_element_by_name(
            RightPanelMainWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.IMPORT_DATA_BUTTON_ELEM)
        ).click()

    def click_add_data_button_element(self):
        WindowsDesktopMainAddInElementCache.invalidate_cache()

        self.windows_desktop_workaround.focus_on_right_side_panel()

        self.get_element_by_name(
            RightPanelMainWindowsDesktopPage.ADD_DATA_BUTTON_ELEM,
            image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.ADD_DATA_BUTTON_ELEM)
        ).click()

    def view_data(self):
        WindowsDesktopMainAddInElementCache.invalidate_cache()

        self.windows_desktop_workaround.focus_on_right_side_panel()

        self.get_element_by_name(
            RightPanelMainWindowsDesktopPage.VIEW_DATA,
            image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.VIEW_DATA)
        ).click()

    def clear_data(self):
        self._open_dots_menu()

        self.get_element_by_name(
            RightPanelMainWindowsDesktopPage.CLEAR_DATA,
            image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.CLEAR_DATA)
        ).click()

        self.get_element_by_accessibility_id(
            RightPanelMainWindowsDesktopPage.CONFIRM_CLEAR_DATA_ACCESSIBILITY_ID,
            image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.CONFIRM_CLEAR_DATA_ACCESSIBILITY_ID)
        ).click()

    def logout(self):
        self._open_dots_menu()

        self.get_element_by_accessibility_id(
            RightPanelMainWindowsDesktopPage.LOGOUT_ACCESSIBILITY_ID,
            image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.LOGOUT_ACCESSIBILITY_ID)
        ).click()

    def _open_dots_menu(self):
        self.windows_desktop_workaround.focus_on_right_side_panel()

        self.get_element_by_name(
            RightPanelMainWindowsDesktopPage.DOTS_MENU_NAME,
            image_name=self.prepare_image_name(RightPanelMainWindowsDesktopPage.DOTS_MENU_NAME)
        ).click()
