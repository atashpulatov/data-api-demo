from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver import ActionChains

from util.const import DEFAULT_WAIT_AFTER_SEND_KEY, SEND_KEYS_RETRY_NUMBER, AFTER_OPERATION_WAIT_TIME
from util.exception.MstrException import MstrException
from util.util import Util


class BaseElement:
    def __init__(self, raw_element, driver):
        self.__element = raw_element
        self.__driver = driver

    def click(self, offset_x=None, offset_y=None):
        if offset_x is None or offset_y is None:
            try:
                self.__element.click()
            except ElementClickInterceptedException as e:
                Util.log_error(e)
                Util.pause(120)  # wait for debug purposes
        else:
            (ActionChains(self.__driver)
             .move_to_element_with_offset(self.__element, offset_x if offset_x else 0, offset_y if offset_y else 0)
             .pause(AFTER_OPERATION_WAIT_TIME)
             .click()
             .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def right_click(self):
        (ActionChains(self.__driver)
         .move_to_element(self.__element)
         .context_click()
         .perform())

    @property
    def id(self):
        return self.__element.id

    def clear(self):
        self.__element.clear()

    @property
    def text(self):
        return self.__element.text

    def get_attribute(self, attribute_name):
        return self.__element.get_attribute(attribute_name)

    def find_element_by_xpath(self, selector):
        return self.__element.find_element_by_xpath(selector)

    def find_elements_by_xpath(self, selector):
        return self.__element.find_elements_by_xpath(selector)

    def find_element(self, selector_type, selector):
        return self.__element.find_element(selector_type, selector)

    def value_of_css_property(self, property_name):
        return self.__element.value_of_css_property(property_name)

    def move_to(self, offset_x=None, offset_y=None):
        if offset_x is None or offset_y is None:
            (ActionChains(self.__driver)
             .move_to_element(self.__element)
             .pause(AFTER_OPERATION_WAIT_TIME)
             .perform())
        else:
            (ActionChains(self.__driver)
             .move_to_element_with_offset(self.__element, offset_x if offset_x else 0, offset_y if offset_y else 0)
             .pause(AFTER_OPERATION_WAIT_TIME)
             .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def send_keys_raw(self, special_key):
        self.__element.send_keys(special_key)

    def send_keys(self, text):
        """
        Sends text (keys) to this element and verifies it's correctness.

        In case of sending incomplete text, execute slower fallback method.

        :param text: text to send
        """

        self.__element.send_keys(text)

        if not self._check_if_keys_sent_correctly(text):
            self._execute_fallback_send_keys(text)

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def _execute_fallback_send_keys(self, text):
        """
        Fallback methods sending text (keys) to this element. Waits after sending each character and repeats entering
        when even with waiting text is incorrect.
        :param text: text to send
        """
        if text:
            for i in range(0, SEND_KEYS_RETRY_NUMBER):
                for c in text:
                    self.__element.send_keys(c)

                    Util.pause(DEFAULT_WAIT_AFTER_SEND_KEY)

                if self._check_if_keys_sent_correctly(text):
                    return

                self.__element.clear()

            raise MstrException('Error while sending keys')

    def _check_if_keys_sent_correctly(self, text):
        """
        Checks if this element contains expected text.

        element.text - should contain text for Windows Desktop
        element.get_attribute('value') - should contain text for browsers

        TODO check Mac Desktop; TODO verify platform independence

        :param text: expected text
        :return: True if text is correct, False otherwise
        """
        text_property = self.__element.text
        if text_property == text:
            return True

        value_attribute = self.__element.get_attribute('value')
        if value_attribute == text:
            return True

        Util.log_warning('Error while sending keys, expected: [%s], was text_property: [%s] '
                         'and value_attribute: [%s]' % (text, text_property, value_attribute))

        return False
