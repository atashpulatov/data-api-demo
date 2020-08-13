from selenium.common.exceptions import ElementClickInterceptedException, NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By

from framework.util.const import DEFAULT_WAIT_AFTER_SEND_KEY, SEND_KEYS_RETRY_NUMBER, AFTER_OPERATION_WAIT_TIME, \
    ELEMENT_SEARCH_RETRY_NUMBER, ELEMENT_SEARCH_RETRY_INTERVAL
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class BaseElement:
    NAME_ATTRIBUTE = 'Name'

    def __init__(self, raw_element, driver):
        self.__element = raw_element
        self.__driver = driver

    def __eq__(self, element_to_compare):
        return self.id == element_to_compare.id

    # TODO refactor and remove
    def get_element(self):
        return self.__element

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

    def move_to_and_click(self, offset_x=None, offset_y=None):
        self.move_to(offset_x, offset_y)

        ActionChains(self.__driver).click().perform()

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def double_click(self, offset_x=None, offset_y=None):
        if offset_x is None or offset_y is None:
            (ActionChains(self.__driver)
             .move_to_element(self.__element)
             .pause(AFTER_OPERATION_WAIT_TIME)
             .double_click()
             .perform())
        else:
            (ActionChains(self.__driver)
             .move_to_element_with_offset(self.__element, offset_x if offset_x else 0, offset_y if offset_y else 0)
             .pause(AFTER_OPERATION_WAIT_TIME)
             .double_click()
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

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    @property
    def text(self):
        return self.__element.text

    def get_attribute(self, attribute_name):
        return self.__element.get_attribute(attribute_name)

    def get_name_by_attribute(self):
        return self.get_attribute(BaseElement.NAME_ATTRIBUTE)

    def get_element_by_css(self, selector):
        return self._get_element(By.CSS_SELECTOR, selector)

    def get_element_by_xpath(self, selector):
        return self._get_element(By.XPATH, selector)

    def check_if_child_element_exists_by_css(self, selector):
        try:
            self._get_element(By.CSS_SELECTOR, selector)
            return True
        except MstrException:
            return False

    def _get_element(self, selector_type, selector):
        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            try:
                raw_element = self.__element.find_element(by=selector_type, value=selector)

                return BaseElement(raw_element, self.__driver)
            except NoSuchElementException:
                Util.log_warning('Element not found, try %s: %s' % (i, selector))
                Util.pause(ELEMENT_SEARCH_RETRY_INTERVAL)
            i += 1

        raise MstrException('Cannot find element: %s' % selector)

    def get_elements_by_name(self, selector):
        raw_elements = self.__element.find_elements_by_name(selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.__driver)

    def get_elements_by_css(self, selector):
        raw_elements = self.__element.find_elements_by_css_selector(selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.__driver)

    def get_elements_by_xpath(self, selector):
        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            try:
                raw_elements = self.__element.find_elements_by_xpath(selector)

                return BaseElement.wrap_raw_elements(raw_elements, self.__driver)
            except NoSuchElementException:
                Util.log_warning('Element not found, try %s: %s' % (i, selector))
                Util.pause(ELEMENT_SEARCH_RETRY_INTERVAL)
            i += 1

        raise MstrException('Cannot find elements: %s' % selector)

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

    @property
    def size(self):
        return self.__element.size

    @property
    def location(self):
        return self.__element.location

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

    @staticmethod
    def wrap_raw_elements(raw_elements, driver):
        wrapped_elements = []

        for raw_element in raw_elements:
            wrapped_elements.append(BaseElement(raw_element, driver))

        return wrapped_elements
