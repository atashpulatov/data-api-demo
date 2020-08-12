from framework.driver.driver_factory import DriverFactory
from framework.driver.driver_type import DRIVERS_SUPPORTING_IMAGE_RECOGNITION
from framework.pages_base.image_element import ImageElement
from framework.util.config_util import ConfigUtil
from framework.util.test_util import TestUtil
from pages_set.pages_set_factory import PagesSetFactory


def before_all(context):
    context.config.setup_logging(
        format='%(asctime)s %(levelname)-8s %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    ConfigUtil.initialize(context)


def before_scenario(context, scenario):
    if ConfigUtil.is_attaching_to_existing_session_enabled():
        _initialize_using_existing_session(context)
    else:
        _initialize_using_new_session(context)


def _initialize_using_existing_session(context):
    driver_type = ConfigUtil.get_driver_type()

    driver = DriverFactory().get_driver(driver_type)

    if driver_type in DRIVERS_SUPPORTING_IMAGE_RECOGNITION:
        excel_root_element_name = ConfigUtil.get_windows_desktop_excel_root_element_name()
        ImageElement.reset_excel_root_element(driver, excel_root_element_name)

    context.pages = PagesSetFactory().get_pages_set()


def _initialize_using_new_session(context):
    DriverFactory.reset_driver()
    PagesSetFactory.reset_pages_set()

    context.pages = PagesSetFactory().get_pages_set()

    context.pages.start_excel_page().go_to_excel()

    context.pages.start_excel_page().maximize_excel_window()

    context.pages.excel_menu_page().click_add_in_elem()
    context.pages.not_logged_right_panel_page().enable_windows_desktop_workaround_if_needed()


def before_step(context, step):
    pass


def after_scenario(context, scenario):
    if ConfigUtil.is_cleanup_after_tests_enabled():
        context.pages.cleanup_page().clean_up_after_each_test()


def after_all(context):
    if ConfigUtil.is_cleanup_after_tests_enabled():
        TestUtil.global_test_cleanup()
