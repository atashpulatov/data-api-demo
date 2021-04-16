from framework.driver.driver_factory import DriverFactory
from framework.driver.driver_type import DRIVERS_SUPPORTING_IMAGE_RECOGNITION
from framework.pages_base.base_page import BasePage
from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.util.config_util import ConfigUtil
from framework.util.const import Const


class ExcelInitializePage(BasePage):
    def initialize_excel(self, context, locale_name=Const.DEFAULT_LOCALE_NAME):
        WindowsDesktopMainAddInElementCache.invalidate_right_panel_cache()

        if ConfigUtil.is_attaching_to_existing_session_enabled():
            self._initialize_using_existing_session()
        else:
            self.initialize_using_new_session(context, locale_name)

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
