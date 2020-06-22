import time

from appium.webdriver.common.mobileby import MobileBy
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from pages.page_util.element_operation import ElementOperation
from util.const import DEFAULT_TIMEOUT, AFTER_OPERATION_WAIT_TIME
from util.util import Util


class ElementClick(ElementOperation):
    DEFAULT_IMAGE_TIMEOUT = 10

    def __init__(self):
        super().__init__()

    def click_element_by_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, offset_x=0, offset_y=0):
        self._click_element(By.ID, selector, timeout, image_name, offset_x, offset_y)

    def click_element_by_accessibility_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, offset_x=0,
                                          offset_y=0):
        self._click_element(MobileBy.ACCESSIBILITY_ID, selector, timeout, image_name, offset_x, offset_y)

    def click_element_by_css(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, offset_x=0, offset_y=0):
        self._click_element(By.CSS_SELECTOR, selector, timeout, image_name, offset_x, offset_y)

    def click_element_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, offset_x=0, offset_y=0):
        self._click_element(By.XPATH, selector, timeout, image_name, offset_x, offset_y)

    def click_element_by_mobile_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, offset_x=0,
                                      offset_y=0):
        self._click_element(MobileBy.XPATH, selector, timeout, image_name, offset_x, offset_y)

    def click_element_by_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, offset_x=0, offset_y=0):
        self._click_element(By.NAME, selector, timeout, image_name, offset_x, offset_y)

    def click_element_by_xpath_list(self, selectors, timeout=DEFAULT_TIMEOUT, image_name=None, offset_x=0, offset_y=0):
        for selector in selectors:
            try:
                self._click_element(By.XPATH, selector, timeout, image_name, offset_x, offset_y)
                return
            except NoSuchElementException:
                Util.log_warning(('click_element_by_xpath_list', selector))

        raise Exception('No elements found for selectors: ' % selectors)

    def _click_element(self, selector_type, selector, timeout, image_name, offset_x, offset_y):
        if self._click_element_by_image(image_name, offset_x, offset_y):
            return

        start_time = time.time()

        wait = WebDriverWait(self.driver, timeout)
        wait.until(ec.element_to_be_clickable((selector_type, selector)))

        element = self.driver.find_element(selector_type, selector)

        self.save_element_image(element, image_name)

        if offset_x == 0 and offset_y == 0:
            element.click()
        else:
            (ActionChains(self.driver)
             .move_to_element_with_offset(element, offset_x, offset_y)
             .click()
             .perform())

        Util.log_warning(('click element, by selector', selector, time.time() - start_time))

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def _click_element_by_image(self, image_name, offset_x=0, offset_y=0):
        if image_name and self.image_recognition_enabled:
            start_time = time.time()
            element_coordinates = self.find_element_image_center(image_name)

            if element_coordinates:
                self.click_coordinates(element_coordinates, offset_x, offset_y)

                Util.log_warning(('click element, by image', image_name, element_coordinates, time.time() - start_time))

                Util.pause(AFTER_OPERATION_WAIT_TIME)

                return True

        return False
