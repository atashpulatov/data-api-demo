from pages.base_windows_desktop_page import BaseWindowsDesktopPage


class NotLoggedRightPanelWindowsDesktopPage(BaseWindowsDesktopPage):
    OPEN_LOGIN_POPUP_BUTTON_ELEM = 'Login button'

    def click_open_login_pop_up_button(self):
        self.click_element_by_name(NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_ELEM,
                                   image_name=self.prepare_image_name(
                                       NotLoggedRightPanelWindowsDesktopPage.OPEN_LOGIN_POPUP_BUTTON_ELEM))
