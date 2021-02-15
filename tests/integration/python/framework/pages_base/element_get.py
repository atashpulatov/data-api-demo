import time

from appium.webdriver.common.mobileby import MobileBy
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By

from framework.driver.driver_factory import DriverFactory
from framework.pages_base.base_element import BaseElement
from framework.pages_base.element_check import ElementCheck
from framework.pages_base.image_element import ImageElement
from framework.util.config_util import ConfigUtil
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class ElementGet(ElementCheck):
    def __init__(self):
        super().__init__()

        self.driver = DriverFactory().get_driver()

        self.image_recognition_enabled = ConfigUtil.is_image_recognition_enabled()

    def get_element_by_id(self, selector, timeout=Const.DEFAULT_TIMEOUT, safe=False):
        return self._get_base_element_wrapper(By.ID, selector, timeout, safe)

    def get_element_by_id_no_visibility_checked(self, selector, timeout=Const.DEFAULT_TIMEOUT):
        return BaseElement(self._get_raw_element_no_visibility_checked(By.ID, selector, timeout), self.driver)

    def get_element_by_css(self, selector, timeout=Const.DEFAULT_TIMEOUT, safe=False):
        return self._get_base_element_wrapper(By.CSS_SELECTOR, selector, timeout, safe)

    def get_element_by_css_no_visibility_checked(self, selector, timeout=Const.DEFAULT_TIMEOUT):
        return BaseElement(self._get_raw_element_no_visibility_checked(By.CSS_SELECTOR, selector, timeout), self.driver)

    def get_element_by_xpath(self, selector, timeout=Const.DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_wrapper(
            self.get_element_info_by_xpath, By.XPATH, selector, timeout, image_name, safe)

    def get_element_by_class_name(self, selector, timeout=Const.DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_wrapper(
            self.get_element_info_by_class_name, By.CLASS_NAME, selector, timeout, image_name, safe)

    def get_element_by_name(self, selector, timeout=Const.DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_wrapper(self.get_element_info_by_name, By.NAME, selector, timeout, image_name, safe)

    def get_element_by_accessibility_id(self, selector, timeout=Const.DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_wrapper(
            self.get_element_info_by_mobile_accessibility_id, MobileBy.ACCESSIBILITY_ID,
            selector, timeout, image_name, safe)

    def get_element_by_tag_name(self, selector, timeout=Const.DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_wrapper(
            self.get_element_info_by_tag_name, By.TAG_NAME, selector, timeout, image_name, safe)

    def _get_element_wrapper(self, get_element_info_method, selector_type, selector, timeout, image_name, safe):
        if image_name and self.image_recognition_enabled:
            return self._get_image_element_wrapper(get_element_info_method, selector, timeout, image_name, safe)
        else:
            return self._get_base_element_wrapper(selector_type, selector, timeout, safe)

    def _get_image_element_wrapper(self, get_element_info_method, selector, timeout, image_name, safe):
        raw_element = get_element_info_method(selector, timeout, image_name, safe)

        return ImageElement(raw_element, self.driver) if raw_element else None

    def _get_base_element_wrapper(self, selector_type, selector, timeout, safe):
        raw_element = self._get_raw_element(selector_type, selector, timeout, safe)

        return BaseElement(raw_element, self.driver) if raw_element else None

    def get_elements_by_css(self, selector):
        raw_elements = self._get_raw_elements(By.CSS_SELECTOR, selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.driver)

    def get_elements_by_xpath(self, selector):
        raw_elements = self._get_raw_elements(By.XPATH, selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.driver)

    def get_elements_by_class_name(self, selector):
        raw_elements = self._get_raw_elements(By.CLASS_NAME, selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.driver)

    def get_elements_by_name(self, selector):
        raw_elements = self._get_raw_elements(By.NAME, selector)

        return BaseElement.wrap_raw_elements(raw_elements, self.driver)

    def get_element_by_xpath_list(self, selectors, timeout=Const.DEFAULT_TIMEOUT):
        for selector in selectors:
            try:
                return BaseElement(self._get_raw_element(By.XPATH, selector, timeout), self.driver)
            except NoSuchElementException:
                Util.log(('get_element_by_xpath_list', selector))

    def get_frame_element_by_id(self, selector, timeout=Const.DEFAULT_TIMEOUT):
        return self._get_raw_element(By.ID, selector, timeout)

    def get_frame_element_by_css(self, selector, timeout=Const.DEFAULT_TIMEOUT):
        return self._get_raw_element(By.CSS_SELECTOR, selector, timeout)

    def _get_raw_element(self, selector_type, selector, timeout=Const.DEFAULT_TIMEOUT, safe=False):
        Util.log(('_get_raw_element begin', selector, selector_type, timeout, safe))

        self.driver.implicitly_wait(timeout)

        element = None

        end_time = time.time() + timeout
        while end_time > time.time():
            try:
                element = self.driver.find_element(selector_type, selector)

                if element:
                    break

            except NoSuchElementException:
                pass

            except TimeoutException:
                pass

        self.driver.implicitly_wait(Const.DEFAULT_TIMEOUT)

        if element or safe:
            Util.log(('_get_raw_element end', selector, selector_type, time.time(), end_time, safe, element))
            return element

        raise MstrException(f'No element found, selector_type: [{selector_type}], '
                            f'selector: [{selector}], timeout: [{timeout}]')

    def _get_raw_element_no_visibility_checked(self, selector_type, selector, timeout):
        start_time = time.time()
        Util.log(('_get_raw_element_no_visibility_checked', selector))

        element = self.driver.find_element(selector_type, selector)

        diff_time = time.time() - start_time
        Util.log(('_get_raw_element_no_visibility_checked', selector, diff_time))

        return element

    def _get_raw_elements(self, selector_type, selector):
        i = 0
        while i < Const.ELEMENT_SEARCH_RETRY_NUMBER:
            try:
                return self.driver.find_elements(selector_type, selector)
            except NoSuchElementException:
                Util.log_warning('Element not found, try %s: %s' % (i, selector))
                Util.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)
            i += 1

        raise MstrException('Cannot find element: %s' % selector)

    def get_element_with_focus(self):
        return BaseElement(self.driver.switch_to.active_element, self.driver)
