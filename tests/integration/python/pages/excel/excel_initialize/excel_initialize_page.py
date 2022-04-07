from framework.driver.driver_factory import DriverFactory
from framework.driver.driver_type import DRIVERS_SUPPORTING_IMAGE_RECOGNITION
from framework.pages_base.base_page import BasePage
from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.util.config_util import ConfigUtil
from framework.util.const import Const


class ExcelInitializePage(BasePage):
    CLOSE_DOCUMENT_RECOVERY_PANE_XPATH = '//Custom[@Name="Document Recovery"]//Button[@Name="Close"]'
    EXCEL_DOCUMENT_RECOVERY_CONFIRMATION_OK_BUTTON_XPATH = '//Window[@Name="Microsoft Excel"]//Button[@Name="OK"]'

    def initialize_excel(self, context, locale_name=Const.DEFAULT_LOCALE_NAME):
        WindowsDesktopMainAddInElementCache.invalidate_right_panel_cache()

        if ConfigUtil.is_attaching_to_existing_session_enabled():
            self._initialize_using_existing_session()
        else:
            self.initialize_using_new_session(context, locale_name)

        if ConfigUtil.get_driver_type() == "windows_desktop":
            self.document_recovery_desktop_workaround()

    def _initialize_using_existing_session(self):
        driver_type = ConfigUtil.get_driver_type()

        driver = DriverFactory().get_driver()

        if driver_type in DRIVERS_SUPPORTING_IMAGE_RECOGNITION:
            excel_root_element_name = ConfigUtil.get_windows_desktop_excel_root_element_name()
            ImageElement.reset_excel_root_element(driver, excel_root_element_name)

    def initialize_using_new_session(self, context, locale_name=Const.DEFAULT_LOCALE_NAME):
        context.pages.excel_general_page().go_to_excel(locale_name)

        context.pages.excel_menu_page().click_add_in_elem()
        context.pages.not_logged_right_panel_page().enable_windows_desktop_workaround_if_needed()

    def document_recovery_desktop_workaround(self):
        is_close_recovery_pane_visible = self.check_if_element_exists_by_xpath(
            ExcelInitializePage.CLOSE_DOCUMENT_RECOVERY_PANE_XPATH
        )
        if is_close_recovery_pane_visible:
            self.get_element_by_xpath(
                ExcelInitializePage.CLOSE_DOCUMENT_RECOVERY_PANE_XPATH
            ).click()

        is_confirmation_window_ok_button_visible = self.check_if_element_exists_by_xpath(
            ExcelInitializePage.EXCEL_DOCUMENT_RECOVERY_CONFIRMATION_OK_BUTTON_XPATH
        )

        if is_confirmation_window_ok_button_visible:
            self.get_element_by_xpath(
                ExcelInitializePage.EXCEL_DOCUMENT_RECOVERY_CONFIRMATION_OK_BUTTON_XPATH
            ).click()
