from pages.not_logged_right_panel.not_logged_right_panel_browser_page import NotLoggedRightPanelBrowserPage
from pages_base.base_browser_page import BaseBrowserPage


class AddInLoginBrowserPage(BaseBrowserPage):
    USERNAME_INPUT_ELEM = 'username'
    PASSWORD_INPUT_ELEM = 'password'
    LOGIN_BUTTON_ELEM = 'loginButton'

    def __init__(self):
        super().__init__()
        self.not_logged_right_panel_page = NotLoggedRightPanelBrowserPage()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        self.switch_to_login_pop_up_window()

        username_field = self.get_element_by_id(AddInLoginBrowserPage.USERNAME_INPUT_ELEM)
        username_field.send_keys(username)

        password_field = self.get_element_by_id(AddInLoginBrowserPage.PASSWORD_INPUT_ELEM)
        password_field.send_keys(password)

        self.get_element_by_id(AddInLoginBrowserPage.LOGIN_BUTTON_ELEM).click()

        self.switch_to_excel_workbook_window()
