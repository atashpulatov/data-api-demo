from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import SHORT_TIMEOUT


class NotLoggedRightPanelBrowserPage(BaseBrowserPage):
    OPEN_LOGIN_POPUP_BUTTON_ELEM = 'login-btn'
    ACCEPT_COOKIES_BUTTON_ID = 'accept-cookies-btn'
    ACCEPT_COOKIES_WRAPPER_ID = 'cookies-needed'

    def enable_windows_desktop_workaround_if_needed(self):
        pass

    def click_open_login_pop_up_button(self):
        self.focus_on_add_in_frame()

        self._enable_accept_cookies()

        self.get_element_by_id(NotLoggedRightPanelBrowserPage.OPEN_LOGIN_POPUP_BUTTON_ELEM).click()

    def _enable_accept_cookies(self):
        self.log_page_source()
        accept_cookies_wrapper = self.get_element_by_id_no_visibility_checked(
            NotLoggedRightPanelBrowserPage.ACCEPT_COOKIES_WRAPPER_ID,
            timeout=SHORT_TIMEOUT
        )
        accept_cookies_button = self.get_element_by_id_no_visibility_checked(
            NotLoggedRightPanelBrowserPage.ACCEPT_COOKIES_BUTTON_ID,
            timeout=SHORT_TIMEOUT
        )

        accept_cookies_wrapper_display_value = accept_cookies_wrapper.get_attribute("display")

        if accept_cookies_wrapper_display_value != "None":
            accept_cookies_button.click()
