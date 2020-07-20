from driver.driver_factory import DriverFactory
from driver.driver_type import DRIVERS_SUPPORTING_IMAGE_RECOGNITION
from pages.page_util.image_element import ImageElement
from pages_factory.pages_factory import PagesFactory
from util.config_util import ConfigUtil
from util.test_util import TestUtil


def before_all(context):
    context.config.setup_logging()
    ConfigUtil.initialize(context)


def before_scenario(context, scenario):
    if ConfigUtil.is_attaching_to_existing_session_enabled():
        driver_type = ConfigUtil.get_driver_type()

        driver = DriverFactory().get_driver(driver_type)

        if driver_type in DRIVERS_SUPPORTING_IMAGE_RECOGNITION:
            excel_root_element_name = ConfigUtil.get_windows_desktop_excel_root_element_name()
            ImageElement.reset_excel_root_element(driver, excel_root_element_name)

        context.pages = PagesFactory().get_pages()

    else:
        DriverFactory.reset_driver()
        PagesFactory.reset_pages()

        context.pages = PagesFactory().get_pages()

        context.pages.start_excel_page().go_to_excel()

        context.pages.excel_menu_page().click_add_in_elem()
        context.pages.not_logged_right_panel_page().enable_windows_desktop_workaround_if_needed()

        context.pages.start_excel_page().maximize_excel_window()


def before_step(context, step):
    pass


def after_scenario(context, scenario):
    if ConfigUtil.is_cleanup_after_tests_enabled():
        context.pages.cleanup_page().clean_up_after_each_test()


def after_all(context):
    if ConfigUtil.is_cleanup_after_tests_enabled():
        TestUtil.global_test_cleanup()
