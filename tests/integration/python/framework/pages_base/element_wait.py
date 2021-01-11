import time

from selenium.common.exceptions import StaleElementReferenceException

from framework.util.const import Const
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class ElementWait:
    def wait_until_element_disappears_by_xpath(self, selector, parent_element, timeout=Const.LONG_TIMEOUT):
        """
        Waits until element disappears.

        Element disappears when:

        it is not present,

        or

        is_displayed() is False,

        or

        it is stale (no longer in DOM) - StaleElementReferenceException is raised.

        :param selector: Selector to search for elements.
        :param parent_element: Parent element to start relative search from.
        :param timeout: Timeout threshold in seconds.

        :raises MstrException: when element is still visible after timeout (in seconds).
        """
        end_time = time.time() + timeout

        try:
            while True:
                prompt_field_label = parent_element.get_element_by_xpath_safe(selector)

                if not prompt_field_label or not prompt_field_label.is_displayed():
                    return

                if end_time > time.time():
                    raise MstrException(f'Element is still displayed after {timeout} seconds, selector: [{selector}].')

                Util.pause(Const.DEFAULT_WAIT_BETWEEN_CHECKS)

        except StaleElementReferenceException:
            pass
