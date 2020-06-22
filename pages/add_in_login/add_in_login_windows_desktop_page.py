from selenium.webdriver.common.keys import Keys

from pages.base_page import BasePage
from pages.not_logged_right_panel.not_logged_right_panel_windows_desktop_page import \
    NotLoggedRightPanelWindowsDesktopPage


class AddInLoginWindowsDesktopPage(BasePage):
    USERNAME_INPUT_ELEM = 'username'

    def __init__(self):
        super().__init__()
        self.not_logged_right_panel_page = NotLoggedRightPanelWindowsDesktopPage()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        login_field = self.get_visible_element_by_accessibility_id(AddInLoginWindowsDesktopPage.USERNAME_INPUT_ELEM)

        (self.get_actions()
         .move_to_element(login_field)
         .send_keys(username)
         .send_keys(Keys.TAB)
         .send_keys(password)
         .send_keys(Keys.ENTER)
         .perform())
