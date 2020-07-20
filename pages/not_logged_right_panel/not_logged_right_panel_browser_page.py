from pages.base_browser_page import BaseBrowserPage


class NotLoggedRightPanelBrowserPage(BaseBrowserPage):
    OPEN_LOGIN_POPUP_BUTTON_ELEM = 'login-btn'

    def enable_windows_desktop_workaround_if_needed(self):
        pass

    def click_open_login_pop_up_button(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(NotLoggedRightPanelBrowserPage.OPEN_LOGIN_POPUP_BUTTON_ELEM).click()
