from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround


class NotLoggedRightPanelWindowsDesktopPage(BaseWindowsDesktopPage):
    OPEN_LOGIN_POPUP_BUTTON_ELEM = 'Login button'

    def __init__(self):
        super().__init__()

        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def enable_windows_desktop_workaround_if_needed(self):
        image_data = self.get_element_info_by_name(
            NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_ELEM
        )

        excel_windows_size = ImageElement.excel_element.size

        workaround_enabled = image_data.size['width'] > excel_windows_size['width']

        self.windows_desktop_workaround.setup_windows_desktop_workaround(workaround_enabled)

    def click_open_login_pop_up_button(self):
        self.windows_desktop_workaround.focus_on_right_side_panel()

        self.get_element_by_name(
            NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_ELEM,
            image_name=self.prepare_image_name(NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_ELEM)
        ).click()
