from framework.pages_base.base_browser_page import BaseBrowserPage


class NotLoggedRightPanelBrowserPage(BaseBrowserPage):
    OPEN_LOGIN_POPUP_BUTTON_ELEM = 'login-btn'

    ACCEPT_COOKIES_BUTTON_WRAPPER = 'cookies-needed'
    ACCEPT_COOKIES_BUTTON_ELEM = 'accept-cookies-btn'

    def enable_windows_desktop_workaround_if_needed(self):
        pass

    def click_open_login_pop_up_button(self):
        self.focus_on_add_in_frame()

        self._enable_accept_cookies()

        self.get_element_by_id(NotLoggedRightPanelBrowserPage.OPEN_LOGIN_POPUP_BUTTON_ELEM).click()

    def _enable_accept_cookies(self):
        accept_cookies_button_wrapper = self.get_element_by_id_no_visibility_checked(
            NotLoggedRightPanelBrowserPage.ACCEPT_COOKIES_BUTTON_WRAPPER
        )

        if accept_cookies_button_wrapper.is_displayed():
            self.get_element_by_id(NotLoggedRightPanelBrowserPage.ACCEPT_COOKIES_BUTTON_ELEM).click()
