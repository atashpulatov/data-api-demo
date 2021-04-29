import re

from behave.model_core import Status

from framework.driver.driver_factory import DriverFactory
from framework.driver.driver_type import DRIVER_TYPE_WINDOWS_DESKTOP
from framework.util.config_util import ConfigUtil
from framework.util.debug_on_failure.common_debug_on_failure import CommonDebugOnFailure
from framework.util.exception.mstr_exception import MstrException
from framework.util.util import Util


class PageSourceOnFailure:
    """
    Class responsible for logging page source when tests fail.

    Test fails when its status is Status.failed.

    When enabled (log_page_source_after_failure is true) page source is stored for debug purposes in
    debug_data_folder folder.

    Page source is logged only when test fails during step execution (not during e.g. scenario initialization).

    On Windows Desktop, xml file is cleaned using WIN_DESKTOP_ATTRIBUTES_TO_REMOVE definitions.
    """

    WIN_DESKTOP_ATTRIBUTES_TO_REMOVE = [
        ' AcceleratorKey=".*?"',
        ' AccessKey=""',
        ' AutomationId=""',
        ' CanMaximize=".*?"',
        ' CanMinimize=".*?"',
        ' CanMove=".*?"',
        ' CanResize=".*?"',
        ' CanRotate=".*?"',
        ' ClassName=".*?"',
        ' FrameworkId=".*?"',
        ' HasKeyboardFocus=".*?"',
        ' HasKeyboardFocus=".*?"',
        ' HasKeyboardFocus=".*?"',
        ' HelpText=""',
        ' IsAvailable=".*?"',
        ' IsContentElement=".*?"',
        ' IsControlElement=".*?"',
        ' IsEnabled=".*?"',
        ' IsKeyboardFocusable=".*?"',
        ' IsModal=".*?"',
        ' IsOffscreen=".*?"',
        ' IsPassword=".*?"',
        ' IsRequiredForForm=".*?"',
        ' IsSelected=".*?"',
        ' IsTopmost=".*?"',
        ' ItemStatus=""',
        ' ItemType=""',
        ' LocalizedControlType=".*?"',
        ' Orientation="None"',
        ' ProcessId=".*?"',
        ' RuntimeId=".*?"',
        ' WindowInteractionState=".*?"',
        ' WindowVisualState=".*?"'
    ]

    TAG_TO_FILE_EXTENSION_MAP = {
        '<html': '.html',
        '<?xml': '.xml',
        'Error': '.txt'
    }

    XML_HEADER_UTF_16 = '<?xml version="1.0" encoding="utf-16"?>'
    XML_HEADER_NO_ENCODING = '<?xml version="1.0"?>'

    TEST_DEBUG_FILE_TYPE = 'page_source'

    def __init__(self):
        super().__init__()

        self.driver_type = ConfigUtil.get_driver_type()
        self.driver = DriverFactory().get_driver()

    def log_page_source_on_failure(self, status, step_name):
        """
        Logs page source on step failure.

        :param status: Test status.
        :param name: Step name.
        """
        if status == Status.failed and ConfigUtil.is_log_page_source_after_failure_enabled():
            page_source = self._get_page_source()

            file_name_extension = self._prepare_file_extension(page_source[:5])
            file_name = self._prepare_debug_page_source_file_name(status.name, step_name, file_name_extension)

            self._save_page_source(page_source, file_name)

    def _get_page_source(self):
        try:
            page_source = self.driver.page_source

        except Exception as e:
            error_message = f'Error while getting page source: {e}'

            Util.log_error(error_message)
            return error_message

        cleaned_page_source = self._cleanup_for_windows_desktop(page_source)

        return cleaned_page_source

    def _prepare_file_extension(self, page_source_start_tag):
        for tag in PageSourceOnFailure.TAG_TO_FILE_EXTENSION_MAP:
            if tag == page_source_start_tag:
                return PageSourceOnFailure.TAG_TO_FILE_EXTENSION_MAP[tag]

        raise MstrException(f'Unknown page source content type: [{page_source_start_tag}], '
                            f'allowed: {list(PageSourceOnFailure.TAG_TO_FILE_EXTENSION_MAP.keys())}')

    def _prepare_debug_page_source_file_name(self, status_name, step_name, file_name_extension):
        file_name_suffix = CommonDebugOnFailure().prepare_debug_file_name_prefix(
            PageSourceOnFailure.TEST_DEBUG_FILE_TYPE,
            CommonDebugOnFailure.USAGE_TYPE_STEP,
            status_name,
            step_name
        )

        current_datetime_string = Util.prepare_current_datetime_string()
        file_name = Util.normalize_file_name(f'{current_datetime_string}_{file_name_suffix}')

        return f'{ConfigUtil.get_debug_data_folder()}/{file_name}{file_name_extension}'

    def _cleanup_for_windows_desktop(self, page_source):
        if self.driver_type != DRIVER_TYPE_WINDOWS_DESKTOP:
            return page_source

        cleaned_page_source = []

        page_source_no_encoding = page_source.replace(
            PageSourceOnFailure.XML_HEADER_UTF_16,
            PageSourceOnFailure.XML_HEADER_NO_ENCODING
        )

        single_tag_lines = page_source_no_encoding.replace('><', '>\n<').split('><')

        for line in single_tag_lines:
            for attribute_to_remove in PageSourceOnFailure.WIN_DESKTOP_ATTRIBUTES_TO_REMOVE:
                line = re.sub(attribute_to_remove, '', line)

            cleaned_page_source.append(line)

        return '\n'.join(cleaned_page_source)

    def _save_page_source(self, page_source, file_name):
        with open(file_name, 'w', encoding='utf-8') as file_log:
            print(page_source, file=file_log)
