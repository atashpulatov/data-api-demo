from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException
from pages.not_logged_right_panel.not_logged_right_panel_windows_desktop_page import \
    NotLoggedRightPanelWindowsDesktopPage


class AddInLoginWindowsDesktopPage(BaseWindowsDesktopPage):
    USERNAME_INPUT_ELEM = 'username'
    PASSWORD_INPUT_ELEM = 'password'
    LOGIN_BUTTON_ELEM = 'loginButton'

    POPUP_WINDOW_ELEM = 'NUIDialog'
    POPUP_CLOSE_BUTTON = 'Close'

    AUTH_ERROR_MESSAGE = '//Group[starts-with(@Name,"Configuration Error")]'
    AUTH_ERROR_TITLE_TEXT = 'Authentication Error'
    AUTH_ERROR_OK_BUTTON = "OK"

    def __init__(self):
        super().__init__()

        self.not_logged_right_panel_page = NotLoggedRightPanelWindowsDesktopPage()
        self.windows_desktop_workaround = WindowsDesktopWorkaround()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        self.windows_desktop_workaround.focus_on_popup_window()

        username_field = self.get_element_by_accessibility_id(AddInLoginWindowsDesktopPage.USERNAME_INPUT_ELEM)
        username_field.send_keys(username)

        if password:
            password_field = self.get_element_by_accessibility_id(AddInLoginWindowsDesktopPage.PASSWORD_INPUT_ELEM)
            password_field.send_keys(password)

        self.get_element_by_accessibility_id(AddInLoginWindowsDesktopPage.LOGIN_BUTTON_ELEM).click()

    def verify_authentication_error_and_click_ok(self):
        try:
            if self.check_if_element_exists_by_name(
                AddInLoginWindowsDesktopPage.AUTH_ERROR_TITLE_TEXT,
                image_name=self.prepare_image_name(AddInLoginWindowsDesktopPage.AUTH_ERROR_TITLE_TEXT),
                timeout=SHORT_TIMEOUT
            ):
                self.get_element_by_name_using_parent(
                    self.get_element_by_xpath, AddInLoginWindowsDesktopPage.AUTH_ERROR_MESSAGE,
                    AddInLoginWindowsDesktopPage.AUTH_ERROR_OK_BUTTON,
                    image_name=self.prepare_image_name(AddInLoginWindowsDesktopPage.AUTH_ERROR_OK_BUTTON)
                ).click()
            pass
        except MstrException as exception:
            self.log('No authentication error visible.')
            pass

    def close_login_pop_up(self):
        self.get_element_by_name_using_parent(
            self.get_element_by_class_name, AddInLoginWindowsDesktopPage.POPUP_WINDOW_ELEM,
            AddInLoginWindowsDesktopPage.POPUP_CLOSE_BUTTON,
            image_name=self.prepare_image_name(AddInLoginWindowsDesktopPage.POPUP_CLOSE_BUTTON)
        ).click()
