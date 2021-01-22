from allure_commons._allure import attach
from allure_commons.types import AttachmentType
from behave.model_core import Status

from framework.util.config_util import ConfigUtil
from framework.util.debug_on_failure.common_debug_on_failure import CommonDebugOnFailure
from framework.util.image_util import ImageUtil
from framework.util.util import Util


class ScreenshotOnFailure:
    """
    Class responsible for taking screenshots when tests fail.

    Test fails when its status is Status.failed.

    Screenshots are attached to allure report.

    When enabled (take_debug_screenshot_after_failure is true) screenshots are also stored for debug purposes in
    debug_data_folder folder.

    When test fails on step, screenshots are taken for step and scenario.

    In other cases (e.g. scenario initialization) screenshots are taken only for scenario (no step exists).
    """

    TEST_DEBUG_FILE_TYPE = 'screenshot'

    def take_screenshots_on_failure_step(self, status, name=''):
        """
        Takes screenshots on step failure.

        :param status: Test status.
        :param name: Step name.
        """
        self._take_screenshots_on_failure(CommonDebugOnFailure.USAGE_TYPE_STEP, status, name)

    def take_screenshots_on_failure_scenario(self, status, name=''):
        """
        Takes screenshots on scenario failure.

        :param status: Test status.
        :param name: Scenario name.
        """
        self._take_screenshots_on_failure(CommonDebugOnFailure.USAGE_TYPE_SCENARIO, status, name)

    def _take_screenshots_on_failure(self, usage_type, status, name=''):
        if status == Status.failed:
            file_name_prefix = CommonDebugOnFailure().prepare_debug_file_name_prefix(
                ScreenshotOnFailure.TEST_DEBUG_FILE_TYPE,
                usage_type,
                status.name,
                name
            )

            self._attache_allure_screenshot_after_failure(file_name_prefix)

            self._take_debug_screenshot_after_failure(file_name_prefix)

    def _take_debug_screenshot_after_failure(self, file_name_prefix):
        if ConfigUtil.is_take_debug_screenshot_after_failure_enabled():
            ImageUtil().take_debug_screenshots(file_name_prefix=file_name_prefix)

    def _attache_allure_screenshot_after_failure(self, file_name_prefix):
        allure_file_name = Util.normalize_file_name(file_name_prefix) + ImageUtil.SCREENSHOT_FILE_EXTENSION

        attach(
            ImageUtil().take_screenshot(),
            name=allure_file_name,
            attachment_type=AttachmentType.PNG
        )
