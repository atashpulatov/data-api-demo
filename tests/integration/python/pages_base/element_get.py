import time

from appium.webdriver.common.mobileby import MobileBy
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from pages_base.base_element import BaseElement
from pages_base.element_check import ElementCheck
from pages_base.image_element import ImageElement
from util.const import DEFAULT_TIMEOUT, ELEMENT_SEARCH_RETRY_NUMBER
from util.exception.MstrException import MstrException
from util.util import Util


class ElementGet(ElementCheck):
    def __init__(self):
        super().__init__()

    def get_element_by_id(self, selector, timeout=DEFAULT_TIMEOUT):
        return BaseElement(self._get_raw_element(By.ID, selector, timeout), self.driver)

    def get_element_by_css(self, selector, timeout=DEFAULT_TIMEOUT):
        return BaseElement(self._get_raw_element(By.CSS_SELECTOR, selector, timeout), self.driver)

    def get_element_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        if image_name and self.image_recognition_enabled:
            return ImageElement(self.get_element_coordinates_by_xpath(selector, timeout, image_name), self.driver)
        else:
            return BaseElement(self._get_raw_element(By.XPATH, selector, timeout), self.driver)

    def get_element_by_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        if image_name and self.image_recognition_enabled:
            return ImageElement(self.get_element_coordinates_by_name(selector, timeout, image_name), self.driver)
        else:
            return BaseElement(self._get_raw_element(By.NAME, selector, timeout), self.driver)

    def get_element_by_accessibility_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        if image_name and self.image_recognition_enabled:
            return ImageElement(self.get_element_coordinates_by_mobile_accessibility_id(selector, timeout), self.driver)
        else:
            return BaseElement(self._get_raw_element(MobileBy.ACCESSIBILITY_ID, selector, timeout), self.driver)

    def get_elements_by_css(self, selector):
        raw_elements = self._get_raw_elements(By.CSS_SELECTOR, selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.driver)

    def get_elements_by_xpath(self, selector):
        raw_elements = self._get_raw_elements(By.XPATH, selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.driver)

    def get_elements_by_name(self, selector):
        raw_elements = self._get_raw_elements(By.NAME, selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.driver)

    def get_element_by_xpath_list(self, selectors, timeout=DEFAULT_TIMEOUT):
        for selector in selectors:
            try:
                return BaseElement(self._get_raw_element(By.XPATH, selector, timeout), self.driver)
            except NoSuchElementException:
                Util.log(('get_element_by_xpath_list', selector))

    def get_frame_element_by_id(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._get_raw_element(By.ID, selector, timeout)

    def get_frame_element_by_css(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._get_raw_element(By.CSS_SELECTOR, selector, timeout)

    def _get_raw_element(self, selector_type, selector, timeout):
        start_time = time.time()
        Util.log(('_get_raw_element', selector))

        wait = WebDriverWait(self.driver, timeout)
        wait.until(ec.visibility_of_element_located((selector_type, selector)))

        element = self.driver.find_element(selector_type, selector)

        diff_time = time.time() - start_time
        Util.log(('_get_raw_element', selector, diff_time))

        return element

    def _get_raw_elements(self, selector_type, selector):
        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            try:
                return self.driver.find_elements(selector_type, selector)
            except NoSuchElementException:
                Util.log_warning('Element not found, try %s: %s' % (i, selector))
                Util.pause(3)
            i += 1

        raise MstrException('Cannot find element: %s' % selector)
