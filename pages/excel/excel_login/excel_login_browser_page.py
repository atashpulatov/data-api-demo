from pages.base_page import BasePage
from util.config_util import ConfigUtil


class ExcelLoginBrowserPage(BasePage):
    USERNAME_INPUT_FIELD = 'i0116'
    PASSWORD_FIELD = 'i0118'
    NEXT_BUTTON = 'idSIButton9'
    SIGN_IN_BUTTON = 'idSIButton9'
    YES_BUTTON = 'idSIButton9'

    def login_to_excel(self):
        excel_user_name = ConfigUtil.get_default_excel_user_name()
        user_name_field = self.get_visible_element_by_id(ExcelLoginBrowserPage.USERNAME_INPUT_FIELD)
        self.send_keys(user_name_field, excel_user_name)
        self.click_element_by_id(ExcelLoginBrowserPage.NEXT_BUTTON)

        excel_user_password = ConfigUtil.get_default_excel_user_password()
        user_password_field = self.get_visible_element_by_id(ExcelLoginBrowserPage.PASSWORD_FIELD)
        self.send_keys(user_password_field, excel_user_password)
        self.click_element_by_id(ExcelLoginBrowserPage.SIGN_IN_BUTTON)

        self.click_element_by_id(ExcelLoginBrowserPage.YES_BUTTON)
