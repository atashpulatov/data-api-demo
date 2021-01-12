import time

from selenium.common.exceptions import StaleElementReferenceException

from framework.pages_base.element_get import ElementGet
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class ElementWait(ElementGet):
    """
    Class providing methods for waiting until element disappears.

    Concrete implementation is specified by each method's name, e.g. get_element_info_by_name() uses By.NAME.

    All methods use parent_element (if provided) to improve performance.
    """

    def wait_until_element_disappears_by_name(self, selector, parent_element=None, timeout=Const.LONG_TIMEOUT):
        check_method = parent_element.get_element_by_name if parent_element else self.get_element_by_name

        self._wait_until_element_disappears(check_method, selector, timeout)

    def wait_until_element_disappears_by_xpath(self, selector, parent_element=None, timeout=Const.LONG_TIMEOUT):
        check_method = parent_element.get_element_by_xpath if parent_element else self.get_element_by_xpath

        self._wait_until_element_disappears(check_method, selector, timeout)

    def wait_until_element_disappears_by_tag_name(self, selector, parent_element=None, timeout=Const.LONG_TIMEOUT):
        check_method = parent_element.get_element_by_tag_name if parent_element else self.get_element_by_tag_name

        self._wait_until_element_disappears(check_method, selector, timeout)

    def _wait_until_element_disappears(self, check_if_element_exists_method, selector, timeout):
        """
        Waits until element disappears.

        Element disappears when:

        it is not present,

        or

        is_displayed() is False,

        or

        it is stale (no longer in DOM) - StaleElementReferenceException is raised.

        :param check_if_element_exists_method: Method used for getting element.
        :param selector: Selector to search for elements.
        :param timeout: Timeout threshold in seconds.

        :raises MstrException: when element is still visible after timeout (in seconds).
        """
        end_time = time.time() + timeout

        try:
            while True:
                element = check_if_element_exists_method(selector, timeout=Const.MEDIUM_TIMEOUT, safe=True)

                if not element or not element.is_displayed():
                    return

                if time.time() > end_time:
                    raise MstrException(f'Element is still displayed after {timeout} seconds, selector: [{selector}].')

                Util.pause(Const.DEFAULT_WAIT_BETWEEN_CHECKS)

        except StaleElementReferenceException:
            pass
