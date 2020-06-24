from selenium.webdriver.common.keys import Keys

from pages.base_page import BasePage
from pages.not_logged_right_panel.not_logged_right_panel_mac_desktop_page import NotLoggedRightPanelMacDesktopPage


class AddInLoginMacDesktopPage(BasePage):
    USERNAME_INPUT_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole=" \
                          "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup" \
                          "[@AXSubrole='AXLandmarkMain']/AXGroup[1]/AXTextField[@AXDOMIdentifier='username']"

    PASSWORD_INPUT_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole=" \
                          "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup" \
                          "[@AXSubrole='AXLandmarkMain']/AXGroup[1]/AXTextField[@AXDOMIdentifier='password'"

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
