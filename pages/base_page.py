from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from driver.driver_factory import DriverFactory
from pages.page_util.element_check import ElementCheck
from pages.page_util.element_click import ElementClick
from pages.page_util.element_get import ElementGet
from util.config_util import ConfigUtil
from util.const import AFTER_OPERATION_WAIT_TIME, DEFAULT_WAIT_AFTER_SEND_KEY, SEND_KEYS_RETRY_NUMBER
from util.util import Util


class BasePage(ElementClick, ElementGet, ElementCheck):
    NAME_ATTRIBUTE = 'Name'

    def __init__(self):
        super().__init__()
        driver_type = ConfigUtil.get_driver_type()

        self.driver = DriverFactory().get_driver(driver_type)

    def log(self, obj):
        Util.log(obj)

    def log_warning(self, obj):
        Util.log_warning(obj)

    def log_error(self, obj):
        Util.log_error(obj)

    def pause(self, secs):
        Util.pause(secs)

    def get_actions(self):
        """
        Returns ActionChains for executing chained low level actions.

        A new object is created each time - using shared object causes issues when moving to elements on Mac desktop
        Excel when executing subsequent tests (first unnecessarily moves to top-left corner of the screen, then to
        required element, which disables clicking in the next step). It's also possible to use low level API
        directly (driver.execute()) without chaining calls.
        """
        return ActionChains(self.driver)

    def wait_for_element_visibility_by_css(self, selector, timeout=20):
        self._wait_for_element_visibility(By.CSS_SELECTOR, selector, timeout)

    def _wait_for_element_visibility(self, selector_type, selector, timeout):
        wait = WebDriverWait(self.driver, timeout)

        wait.until(ec.visibility_of_element_located((selector_type, selector)))

    def click_element_simple(self, element):
        try:
            element.click()
        except ElementClickInterceptedException as e:
            self.log_error(e)
            self.pause(120)  # wait for debug purposes

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def click_element_with_offset(self, element, xoffset=0, yoffset=0):
        (self.get_actions()
         .move_to_element_with_offset(element, xoffset, yoffset)
         .pause(AFTER_OPERATION_WAIT_TIME)
         .click()
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def click_element_right_button(self, element):
        (self.get_actions()
         .move_to_element(element)
         .context_click()
         .perform())

    def move_to_element(self, element, xoffset=0, yoffset=0):
        (self.get_actions()
         .move_to_element_with_offset(element, xoffset, yoffset)
         .pause(2)
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def prepare_image_name(self, image_name):
        return '%s_%s' % (self.__class__.__name__, image_name)

    def get_element_name(self, element):
        return element.get_attribute(BasePage.NAME_ATTRIBUTE)

    def send_special_key(self, element, control_key):
        element.send_keys(control_key)

        self.pause(DEFAULT_WAIT_AFTER_SEND_KEY)

    def send_keys(self, element, text):
        """
        Sends text (keys) to element and verifies it's correctness.

        In case of sending incomplete text, execute slower fallback method.

        :param element: element to send text to
        :param text: text to send
        """

        element.send_keys(text)

        if not self._check_if_keys_sent_correctly(element, text):
            self._execute_fallback_send_keys(element, text)

    def _execute_fallback_send_keys(self, element, text):
        """
        Fallback methods sending text (keys) to element. Waits after sending each character and repeats entering when
        even with waiting text is incorrect.
        :param element: element to send text to
        :param text: text to send
        """
        if text:
            for i in range(0, SEND_KEYS_RETRY_NUMBER):
                for c in text:
                    element.send_keys(c)

                    self.pause(DEFAULT_WAIT_AFTER_SEND_KEY)

                if self._check_if_keys_sent_correctly(element, text):
                    return

                element.clear()

            raise Exception('Error while sending keys')

    def _check_if_keys_sent_correctly(self, element, text):
        """
        Checks if element contains expected text.

        element.text - should contain text for Windows Desktop
        element.get_attribute('value') - should contain text for browsers

        TODO check Mac Desktop; TODO verify platform independence

        :param element: element to check text content
        :param text: expected text
        :return: True if text is correct, False otherwise
        """
        text_property = element.text
        if text_property == text:
            return True

        value_attribute = element.get_attribute('value')
        if value_attribute == text:
            return True

        self.log_warning('Error while sending keys, expected: [%s], was text_property: [%s] '
                         'and value_attribute: [%s]' % (text, text_property, value_attribute))

        return False
