from pages_base.base_page import BasePage
from util.config_util import ConfigUtil


class ExcelLoginBrowserPage(BasePage):
    USERNAME_INPUT_FIELD = 'i0116'
    PASSWORD_FIELD = 'i0118'
    NEXT_BUTTON = 'idSIButton9'
    SIGN_IN_BUTTON = 'idSIButton9'
    YES_BUTTON = 'idSIButton9'

    def login_to_excel(self):
        excel_user_name = ConfigUtil.get_default_excel_user_name()
        user_name_field = self.get_element_by_id(ExcelLoginBrowserPage.USERNAME_INPUT_FIELD)
        user_name_field.send_keys(excel_user_name)

        self.get_element_by_id(ExcelLoginBrowserPage.NEXT_BUTTON).click()

        excel_user_password = ConfigUtil.get_default_excel_user_password()
        user_password_field = self.get_element_by_id(ExcelLoginBrowserPage.PASSWORD_FIELD)
        user_password_field.send_keys(excel_user_password)

        self.get_element_by_id(ExcelLoginBrowserPage.SIGN_IN_BUTTON).click()

        self.get_element_by_id(ExcelLoginBrowserPage.YES_BUTTON).click()
