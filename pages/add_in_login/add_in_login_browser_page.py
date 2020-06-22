from selenium.webdriver.common.keys import Keys

from pages.base_browser_page import BaseBrowserPage
from pages.not_logged_right_panel.not_logged_right_panel_browser_page import NotLoggedRightPanelBrowserPage


class AddInLoginBrowserPage(BaseBrowserPage):
    USERNAME_INPUT_ELEM = 'username'
    LOGIN_BUTTON_ELEM = 'loginButton'

    def __init__(self):
        super().__init__()
        self.not_logged_right_panel_page = NotLoggedRightPanelBrowserPage()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        self.switch_to_login_pop_up_window()

        login_field = self.get_visible_element_by_id(AddInLoginBrowserPage.USERNAME_INPUT_ELEM)

        (self.get_actions()
         .move_to_element(login_field)
         .send_keys(username)
         .send_keys(Keys.TAB)
         .send_keys(password)
         .send_keys(Keys.ENTER)
         .perform())

        self.switch_to_excel_workbook_window()
