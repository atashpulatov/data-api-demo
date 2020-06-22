import time

from appium.webdriver.common.mobileby import MobileBy
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from pages.page_util.element_operation import ElementOperation
from util.const import DEFAULT_TIMEOUT, ELEMENT_SEARCH_RETRY_NUMBER
from util.util import Util


class ElementGet(ElementOperation):
    def __init__(self):
        super().__init__()

    def get_visible_element_by_id(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._get_visible_element(By.ID, selector, timeout)

    def get_visible_element_by_accessibility_id(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._get_visible_element(MobileBy.ACCESSIBILITY_ID, selector, timeout)

    def get_visible_element_by_css(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._get_visible_element(By.CSS_SELECTOR, selector, timeout)

    def get_visible_element_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._get_visible_element(By.XPATH, selector, timeout)

    def get_visible_element_by_name(self, selector, timeout=DEFAULT_TIMEOUT):
        return self._get_visible_element(By.NAME, selector, timeout)

    def get_visible_element_by_xpath_list(self, selectors, timeout=DEFAULT_TIMEOUT):
        for selector in selectors:
            try:
                return self._get_visible_element(By.XPATH, selector, timeout)
            except NoSuchElementException:
                Util.log(('get_visible_element_by_xpath_list', selector))

    def get_visible_elements_by_css(self, selector):
        return self._get_visible_elements(By.CSS_SELECTOR, selector)

    def get_visible_elements_by_name(self, selector):
        return self._get_visible_elements(By.NAME, selector)

    def _get_visible_element(self, selector_type, selector, timeout):
        start_time = time.time()
        Util.log(('get_visible_element', selector))

        wait = WebDriverWait(self.driver, timeout)
        wait.until(ec.visibility_of_element_located((selector_type, selector)))

        element = self.driver.find_element(selector_type, selector)

        diff_time = time.time() - start_time
        Util.log(('get_visible_element', selector, diff_time))

        return element

    def _get_visible_elements(self, selector_type, selector):
        return self.driver.find_elements(selector_type, selector)

    def is_element_visible_by_name(self, selector):
        return len(self._find_elements(By.NAME, selector)) > 0

    def _find_elements(self, selector_type, selector):
        start_time = time.time()
        Util.log(('find_elements', selector))

        elements = self.driver.find_elements(selector_type, selector)

        diff_time = time.time() - start_time
        Util.log(('find_elements', selector, diff_time))

        return elements

    def find_element_by_css_from_parent(self, parent_element, selector):
        return self._find_element_from_parent(By.CSS_SELECTOR, parent_element, selector)

    def _find_element_from_parent(self, selector_type, parent_element, selector):
        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            try:
                return parent_element.find_element(selector_type, selector)
            except NoSuchElementException:
                Util.log_warning('Element not found, try %s: %s' % (i, selector))
                Util.pause(5)
            i += 1

        raise Exception('Cannot find element: %s' % selector)
