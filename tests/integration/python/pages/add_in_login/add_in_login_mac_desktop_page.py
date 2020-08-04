from selenium.webdriver.common.keys import Keys

from pages.not_logged_right_panel.not_logged_right_panel_mac_desktop_page import NotLoggedRightPanelMacDesktopPage
from pages_base.base_mac_desktop_page import BaseMacDesktopPage


class AddInLoginMacDesktopPage(BaseMacDesktopPage):
    LOGIN_WINDOW = BaseMacDesktopPage.EXCEL_WINDOW_ELEM + "/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/" \
                                                          "AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkMain']/AXGroup[1]"

    USERNAME_INPUT_ELEM = LOGIN_WINDOW + "/AXTextField[@AXDOMIdentifier='username']"

    PASSWORD_INPUT_ELEM = LOGIN_WINDOW + "/AXTextField[@AXDOMIdentifier='password']"

    def __init__(self):
        super().__init__()
        self.not_logged_right_panel_page = NotLoggedRightPanelMacDesktopPage()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        username_field = self.get_element_by_xpath(AddInLoginMacDesktopPage.USERNAME_INPUT_ELEM)
        username_field.send_keys(username)

        password_field = self.get_element_by_xpath(AddInLoginMacDesktopPage.PASSWORD_INPUT_ELEM)
        password_field.send_keys_raw(password)

        password_field.send_keys_raw(Keys.ENTER)
