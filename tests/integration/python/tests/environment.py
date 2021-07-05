import logging

from behave.contrib.scenario_autoretry import patch_scenario_with_autoretry

from framework.driver.driver_factory import DriverFactory
from framework.util.config_util import ConfigUtil
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

    except Exception as e:
        logging.exception('')
        raise e


def before_scenario(context, scenario):
    try:
        # reset_framework() is used here and by step I opened Excel and logged in to Excel using locale "{locale_name}"
        context.reset_framework = _reset_framework

        if ConfigUtil.is_attaching_to_existing_session_enabled():
            context.pages = PagesSetFactory().get_pages_set()
        else:
            context.reset_framework(context)

    except Exception as e:
        logging.exception('')
        raise e


def _reset_framework(context, restart_driver_during_run=False):
    DriverFactory.reset_driver(restart_driver_during_run)
    PagesSetFactory.reset_pages_set()

    context.pages = PagesSetFactory().get_pages_set()


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
