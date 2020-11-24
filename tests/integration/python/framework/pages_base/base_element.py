import time

from selenium.common.exceptions import ElementClickInterceptedException, NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.color import Color

from framework.util.const import DEFAULT_WAIT_AFTER_SEND_KEY, SEND_KEYS_RETRY_NUMBER, AFTER_OPERATION_WAIT_TIME, \
    ELEMENT_SEARCH_RETRY_NUMBER, ELEMENT_SEARCH_RETRY_INTERVAL, DEFAULT_TIMEOUT, DEFAULT_WAIT_BETWEEN_CHECKS, \
    MEDIUM_TIMEOUT
from framework.util.exception.MstrException import MstrException
from framework.util.image_util import ImageUtil
from framework.util.util import Util


class BaseElement:
    NAME_ATTRIBUTE = 'Name'
    AUTOMATION_ID_ATTRIBUTE = 'AutomationId'
    IS_OFFSCREEN_ATTRIBUTE = 'IsOffscreen'

    ATTRIBUTE_VALUE_TRUE = 'true'

    BACKGROUND_COLOR_PROPERTY = 'background-color'
    OPACITY_PROPERTY = 'opacity'

    def __init__(self, raw_element, driver):
        self.__element = raw_element
        self.__driver = driver
        self.__image = None

        self.image_util = ImageUtil()

    def __eq__(self, element_to_compare):
        return self.id == element_to_compare.id

    def click(self, offset_x=None, offset_y=None):
        if offset_x is None or offset_y is None:
            try:
                self.__element.click()
            except ElementClickInterceptedException as e:
                Util.log_error(e)
                raise MstrException('Error while clicking an element.')
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

    def right_click(self, offset_x=None, offset_y=None):
        if offset_x is None or offset_y is None:
            (ActionChains(self.__driver)
             .move_to_element(self.__element)
             .pause(AFTER_OPERATION_WAIT_TIME)
             .context_click()
             .perform())
        else:
            (ActionChains(self.__driver)
             .move_to_element_with_offset(self.__element, offset_x if offset_x else 0, offset_y if offset_y else 0)
             .pause(AFTER_OPERATION_WAIT_TIME)
             .context_click()
             .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    @property
    def id(self):
        return self.__element.id

    def clear(self):
        self.__element.clear()

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    @property
    def text(self):
        return self.__element.text

    @property
    def tag_name(self):
        return self.__element.tag_name

    def get_attribute(self, attribute_name):
        return self.__element.get_attribute(attribute_name)

    def is_selected(self):
        return self.__element.is_selected()

    def is_displayed(self):
        return self.__element.is_displayed()

    def get_name_by_attribute(self):
        return self.get_attribute(BaseElement.NAME_ATTRIBUTE)

    def get_automation_id_by_attribute(self):
        return self.get_attribute(BaseElement.AUTOMATION_ID_ATTRIBUTE)

    def is_offscreen_by_attribute(self):
        return self.get_attribute(BaseElement.IS_OFFSCREEN_ATTRIBUTE) == BaseElement.ATTRIBUTE_VALUE_TRUE

    def get_element_by_css(self, selector):
        return self.get_element(By.CSS_SELECTOR, selector, timeout=DEFAULT_TIMEOUT)

    def get_element_by_xpath(self, selector):
        return self.get_element(By.XPATH, selector, timeout=DEFAULT_TIMEOUT)

    def get_element_by_name(self, selector):
        return self.get_element(By.NAME, selector, timeout=DEFAULT_TIMEOUT)

    def get_element_by_tag_name(self, selector):
        return self.get_element(By.TAG_NAME, selector, timeout=DEFAULT_TIMEOUT)

    def check_if_element_exists_by_tag_name(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._check_if_element_exists(By.TAG_NAME, selector, timeout)

    def check_if_element_exists_by_name(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._check_if_element_exists(By.NAME, selector, timeout)

    def check_if_element_exists_by_css(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._check_if_element_exists(By.CSS_SELECTOR, selector, timeout)

    def _check_if_element_exists(self, selector_type, selector, timeout=DEFAULT_TIMEOUT):
        try:
            self.get_element(selector_type, selector, timeout)
            return True
        except MstrException:
            return False

    def get_element(self, selector_type, selector, timeout=DEFAULT_TIMEOUT):
        """
        Gets element which is a child of this base element.

        This is a generic method used by framework classes. In Pages implementation, for code clarity,
        please use get_element_by_* if possible.

        :param selector_type: Selector type to be used when searching for element (e.g. By.NAME).
        :param selector: Selector to be used when searching for element (e.g. 'Close').
        :param timeout: Timeout threshold in seconds, when reached MstrException is raised.

        :raises MstrException when timeout's threshold is reached.

        :return: BaseElement found using selector_type and selector.
        """
        end_time = time.time() + timeout
        while True:
            try:
                raw_element = self.__element.find_element(by=selector_type, value=selector)

                return BaseElement(raw_element, self.__driver)
            except NoSuchElementException:
                pass

            Util.pause(DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException(('Element not found', selector))

    def get_elements_by_name(self, selector):
        raw_elements = self.__element.find_elements_by_name(selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.__driver)

    def get_elements_by_tag_name(self, selector):
        raw_elements = self.__element.find_elements_by_tag_name(selector)

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

    def get_background_color(self):
        """
        Gets background color of this element using CSS property 'background-color'.

        Works only for Browsers.

        :return: Background color as a hex string, e.g. '#ffaac1'.
        """
        css_color_property = self._value_of_css_property(BaseElement.BACKGROUND_COLOR_PROPERTY)

        return Color.from_string(css_color_property).hex

    def get_opacity(self):
        return self._value_of_css_property(BaseElement.OPACITY_PROPERTY)

    def _value_of_css_property(self, property_name):
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

    @property
    def x(self):
        return self.location['x']

    @property
    def y(self):
        return self.location['y']

    def send_keys(self, special_key):
        self.__element.send_keys(special_key)

    def send_keys_with_check(self, text):
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

    def get_element_by_text_from_elements_list_by_css(self, selector, expected_text, timeout=DEFAULT_TIMEOUT):
        """
        Gets element from elements list found by a selector (starting from this element) that contains expected text.

        :param selector: selector used to find list of elements, starting from this element
        :param expected_text: expected text
        :param timeout: optional timeout

        :raises MstrException: when no element found.
        """
        end_time = time.time() + timeout
        while True:
            elements = self.get_elements_by_css(selector)

            element = next((item for item in elements if item.text == expected_text), None)
            if element:
                return element

            Util.pause(DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException(f'No element found, selector: {selector}, text: {expected_text}')

    def wait_until_disappears(self, timeout=MEDIUM_TIMEOUT):
        """
        Waits until this element disappears.

        :raises MstrException: when element is still visible after timeout (in seconds).
        """
        start_time = time.time()

        while self.is_displayed():
            if time.time() - start_time > timeout:
                raise MstrException(f'Element is still displayed after {timeout} seconds.')

    def pick_color(self, offset_x=0, offset_y=0, force_new_screenshot=False):
        """
        Picks color from coordinates relative to element left top corner (0, 0).

        It uses this element image screenshot to check the color.

        :param offset_x: X coordinate to pick color from.
        :param offset_y: Y coordinate to pick color from.
        :param force_new_screenshot: Flag indicating if element screenshot should be taken even if
        cached image already exists.

        :return: Color as a hex string, e.g. '#ffaac1'.
        """
        self._store_element_image(force_new_screenshot)

        return self.image_util.get_color_from_image(self.__image, offset_x, offset_y)

    def _store_element_image(self, force_new_screenshot=False):
        """
        Stores this element screenshot image in this object.

        New image is stored in self.__image if it doesn't already exist or force_new_screenshot flag is True.

        :param force_new_screenshot: Flag indicating if element screenshot should be taken even if
        cached image already exists.
        """
        if self.__image is None or force_new_screenshot:
            self.__image = self.image_util.get_element_image(self)
