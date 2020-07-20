from pages.base_page import BasePage
from pages.not_logged_right_panel.not_logged_right_panel_windows_desktop_page import \
    NotLoggedRightPanelWindowsDesktopPage
from pages.page_util.windows_desktop_workaround import WindowsDesktopWorkaround


class AddInLoginWindowsDesktopPage(BasePage):
    USERNAME_INPUT_ELEM = 'username'
    PASSWORD_INPUT_ELEM = 'password'
    LOGIN_BUTTON_ELEM = 'loginButton'

    def __init__(self):
        super().__init__()

        self.not_logged_right_panel_page = NotLoggedRightPanelWindowsDesktopPage()
        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        self.windows_desktop_workaround.focus_on_popup_window()

        username_field = self.get_element_by_accessibility_id(AddInLoginWindowsDesktopPage.USERNAME_INPUT_ELEM)
        username_field.send_keys_raw(username)

        password_field = self.get_element_by_accessibility_id(AddInLoginWindowsDesktopPage.USERNAME_INPUT_ELEM)
        password_field.send_keys(password)

        self.get_element_by_accessibility_id(AddInLoginWindowsDesktopPage.LOGIN_BUTTON_ELEM).click()
