from framework.pages_base.base_browser_page import BaseBrowserPage
from pages.not_logged_right_panel.not_logged_right_panel_browser_page import NotLoggedRightPanelBrowserPage


class AddInLoginBrowserPage(BaseBrowserPage):
    USERNAME_INPUT_ELEM = 'username'
    PASSWORD_INPUT_ELEM = 'password'
    LOGIN_BUTTON_ELEM = 'loginButton'

    AUTH_ERROR_TITLE_ELEM = '.mstrd-MessageBox-titleSpan'
    AUTH_ERROR_TITLE_TEXT = 'Authentication Error'
    AUTH_ERROR_OK_BUTTON_ID = "ActionLinkContainer"

    PRIVILEGES_ERROR_MESSAGE_ELEM = '#dontHaveAccessHeader'
    PRIVILEGES_ERROR_MESSAGE_TEXT = 'You do not have the rights to access MicroStrategy for Office'
    PRIVILEGES_ERROR_TRY_AGAIN_BUTTON_ID = 'tryAgainSpan'

    def __init__(self):
        super().__init__()
        self.not_logged_right_panel_page = NotLoggedRightPanelBrowserPage()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        self.switch_to_login_pop_up_window()

        username_field = self.get_element_by_id(AddInLoginBrowserPage.USERNAME_INPUT_ELEM)
        username_field.send_keys_with_check(username)

        password_field = self.get_element_by_id(AddInLoginBrowserPage.PASSWORD_INPUT_ELEM)
        password_field.send_keys_with_check(password)

        self.get_element_by_id(AddInLoginBrowserPage.LOGIN_BUTTON_ELEM).click()

        self.switch_to_excel_workbook_window()

    def verify_authentication_error_and_click_ok(self):
        self.switch_to_login_pop_up_window()

        self.find_element_in_list_by_text(
            AddInLoginBrowserPage.AUTH_ERROR_TITLE_ELEM, 
            AddInLoginBrowserPage.AUTH_ERROR_TITLE_TEXT
        )
        self.get_element_by_id(AddInLoginBrowserPage.AUTH_ERROR_OK_BUTTON_ID).click()

    def verify_plugin_privileges_message_and_click_try_again(self):
        self.focus_on_add_in_frame()

        self.find_element_in_list_by_text(
            AddInLoginBrowserPage.PRIVILEGES_ERROR_MESSAGE_ELEM, 
            AddInLoginBrowserPage.PRIVILEGES_ERROR_MESSAGE_TEXT
        )
        self.get_element_by_id(AddInLoginBrowserPage.PRIVILEGES_ERROR_TRY_AGAIN_BUTTON_ID).click()

    def close_login_pop_up(self):
        self.switch_to_login_pop_up_window()

        self.close_current_tab()

        self.switch_to_excel_workbook_window()
