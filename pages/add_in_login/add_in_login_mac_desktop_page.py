from selenium.webdriver.common.keys import Keys

from pages.base_page import BasePage
from pages.not_logged_right_panel.not_logged_right_panel_mac_desktop_page import NotLoggedRightPanelMacDesktopPage


class AddInLoginMacDesktopPage(BasePage):
    USERNAME_INPUT_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole=" \
                          "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup" \
                          "[@AXSubrole='AXLandmarkMain']/AXGroup[1]/AXTextField[@AXDOMIdentifier='username']"

    LOGIN_BUTTON_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole=" \
                        "'AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole=" \
                        "'AXLandmarkMain']/AXGroup[1]/AXButton[@AXDOMIdentifier='loginButton']"

    def __init__(self):
        super().__init__()
        self.not_logged_right_panel_page = NotLoggedRightPanelMacDesktopPage()

    def login(self, username, password):
        self.not_logged_right_panel_page.click_open_login_pop_up_button()

        login_field = self.get_visible_element_by_xpath(AddInLoginMacDesktopPage.USERNAME_INPUT_ELEM)

        (self.get_actions()
         .move_to_element(login_field)
         .send_keys(username)
         .send_keys(Keys.TAB)
         .send_keys(password)
         .send_keys(Keys.ENTER)
         .perform())
