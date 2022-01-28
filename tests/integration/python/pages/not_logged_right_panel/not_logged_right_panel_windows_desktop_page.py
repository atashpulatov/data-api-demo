from selenium.common.exceptions import StaleElementReferenceException

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround


class NotLoggedRightPanelWindowsDesktopPage(BaseWindowsDesktopPage):
    OPEN_LOGIN_POPUP_BUTTON_NAME = 'Login button'
    OPEN_LOGIN_POPUP_BUTTON_XPATH = '//Button[@Name="' + OPEN_LOGIN_POPUP_BUTTON_NAME + '"]'

    ACCEPT_COOKIES_BUTTON_ELEM = 'Enable Cookies'

    def __init__(self):
        super().__init__()

        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def enable_windows_desktop_workaround_if_needed(self):
        self._enable_accept_cookies()

        image_data = self.get_element_info_by_name(
            NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_NAME
        )

        excel_windows_size = ImageElement.excel_element.size

        workaround_enabled = image_data.size['width'] > excel_windows_size['width']

        self.windows_desktop_workaround.setup_windows_desktop_workaround(workaround_enabled)

    def click_open_login_pop_up_button(self):
        self.windows_desktop_workaround.focus_on_right_side_panel()

        self._enable_accept_cookies()

        try:
            self.get_element_by_xpath(NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_XPATH).click()
        except StaleElementReferenceException:
            self.get_element_by_xpath(NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_XPATH).click()

    def _enable_accept_cookies(self):
        enable_button = self.get_elements_by_name(NotLoggedRightPanelWindowsDesktopPage.ACCEPT_COOKIES_BUTTON_ELEM)

        if len(enable_button) == 1:
            enable_button[0].click()
