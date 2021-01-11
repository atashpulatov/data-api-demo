import logging

from behave.contrib.scenario_autoretry import patch_scenario_with_autoretry

from framework.driver.driver_factory import DriverFactory
from framework.driver.driver_type import DRIVERS_SUPPORTING_IMAGE_RECOGNITION
from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.util.config_util import ConfigUtil
from framework.util.const import Const
from framework.util.debug_on_failure.page_source_on_failure import PageSourceOnFailure
from framework.util.debug_on_failure.screenshot_on_failure import ScreenshotOnFailure
from framework.util.test_util import TestUtil
from pages_set.pages_set_factory import PagesSetFactory


def before_all(context):
    try:
        context.config.setup_logging(
            format='%(asctime)s %(levelname)-7s %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        ConfigUtil.initialize(context)

        TestUtil.global_test_startup()
    except Exception as e:
        logging.exception('')
        raise e


def before_feature(context, feature):
    try:
        max_attempts = ConfigUtil.get_max_no_of_test_executions()

        for scenario in feature.scenarios:
            patch_scenario_with_autoretry(scenario, max_attempts=max_attempts)

        WindowsDesktopMainAddInElementCache.invalidate_right_panel_cache()
    except Exception as e:
        logging.exception('')
        raise e


def before_scenario(context, scenario):
    try:
        if ConfigUtil.is_attaching_to_existing_session_enabled():
            _initialize_using_existing_session(context)
        else:
            initialize_using_new_session(context)
    except Exception as e:
        logging.exception('')
        raise e


def _initialize_using_existing_session(context):
    driver_type = ConfigUtil.get_driver_type()

    driver = DriverFactory().get_driver(driver_type)

    if driver_type in DRIVERS_SUPPORTING_IMAGE_RECOGNITION:
        excel_root_element_name = ConfigUtil.get_windows_desktop_excel_root_element_name()
        ImageElement.reset_excel_root_element(driver, excel_root_element_name)

    context.pages = PagesSetFactory().get_pages_set()


def initialize_using_new_session(context, locale_name=Const.DEFAULT_LOCALE_NAME):
    DriverFactory.reset_driver()
    PagesSetFactory.reset_pages_set()

    context.pages = PagesSetFactory().get_pages_set()

    context.pages.excel_general_page().go_to_excel(locale_name)

    context.pages.excel_general_page().maximize_excel_window()

    context.pages.excel_menu_page().click_add_in_elem()
    context.pages.not_logged_right_panel_page().enable_windows_desktop_workaround_if_needed()


def after_step(context, step):
    try:
        ScreenshotOnFailure().take_screenshots_on_failure_step(step.status, step.name)
        PageSourceOnFailure().log_page_source_on_failure(step.status, step.name)

    except Exception as e:
        logging.exception('')
        raise e


def after_scenario(context, scenario):
    try:
        ScreenshotOnFailure().take_screenshots_on_failure_scenario(scenario.status, scenario.name)

        if ConfigUtil.is_cleanup_after_tests_enabled():
            context.pages.cleanup_page().clean_up_after_each_test()
    except Exception as e:
        logging.exception('')
        raise e


def after_all(context):
    try:
        if ConfigUtil.is_cleanup_after_tests_enabled():
            TestUtil.global_test_cleanup()
    except Exception as e:
        logging.exception('')
        raise e
