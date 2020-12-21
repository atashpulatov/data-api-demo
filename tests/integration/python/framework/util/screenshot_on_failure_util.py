from allure_commons._allure import attach
from allure_commons.types import AttachmentType
from behave.model_core import Status

from framework.util.config_util import ConfigUtil
from framework.util.image_util import ImageUtil


class ScreenshotOnFailure:
    """
    Class responsible for taking screenshots when tests fail.

    Test fails when it's status is Status.failed.

    Screenshots are attached to allure report.

    When enabled (take_debug_screenshot_after_failure is true) screenshots are also stored for debug purposes in
    image_recognition_screenshots_folder folder.

    When test fails on step, screenshots are taken for step and scenario.
    In other cases (e.g. scenario initialization) screenshots are taken only for scenario (no step exists).
    """

    TEST_FAILURE_SCREENSHOT_PREFIX = 'test'

    USAGE_TYPE_STEP = 'step'
    USAGE_TYPE_SCENARIO = 'scenario'

    def take_screenshots_on_failure_step(self, status, name=''):
        """
        Takes screenshots on step failure.

        :param status: Test status.
        :param name: Step name.
        """
        self._take_screenshots_on_failure(ScreenshotOnFailure.USAGE_TYPE_STEP, status, name)

    def take_screenshots_on_failure_scenario(self, status, name=''):
        """
        Takes screenshots on scenario failure.

        :param status: Test status.
        :param name: Scenario name.
        """
        self._take_screenshots_on_failure(ScreenshotOnFailure.USAGE_TYPE_SCENARIO, status, name)

    def _take_screenshots_on_failure(self, usage_type, status, name=''):
        if status == Status.failed:
            file_name_prefix = self._prepare_file_name_prefix(usage_type, status.name, name)

            self._take_debug_screenshot_after_failure(file_name_prefix)

            self._attache_allure_screenshot_after_failure(file_name_prefix)

    def _prepare_file_name_prefix(self, usage_type, status_name, name):
        return f'{ScreenshotOnFailure.TEST_FAILURE_SCREENSHOT_PREFIX}_{usage_type}_{status_name}_{name[:30]}_'

    def _take_debug_screenshot_after_failure(self, file_name_prefix):
        if ConfigUtil.is_take_debug_screenshot_after_failure_enabled:
            ImageUtil().take_debug_screenshots(file_name_prefix=file_name_prefix)

    def _attache_allure_screenshot_after_failure(self, file_name_prefix):
        attach(
            ImageUtil().take_screenshot(),
            name=file_name_prefix + ImageUtil.SCREENSHOT_FILE_EXTENSION,
            attachment_type=AttachmentType.PNG
        )
