import time

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from pages.page_util.element_operation import ElementOperation
from util.const import DEFAULT_TIMEOUT
from util.util import Util


class ElementCheck(ElementOperation):
    DEFAULT_IMAGE_TIMEOUT = 10

    def __init__(self):
        super().__init__()

    def check_element_by_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._check_element(By.NAME, selector, timeout, image_name)

    def check_element_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._check_element(By.XPATH, selector, timeout, image_name)

    def _check_element(self, selector_type, selector, timeout, image_name):
        element_coordinates = self._check_element_by_image(image_name)
        if element_coordinates:
            return element_coordinates

        start_time = time.time()

        try:
            wait = WebDriverWait(self.driver, timeout)
            wait.until(ec.visibility_of_element_located((selector_type, selector)))

            element = self.driver.find_element(selector_type, selector)

            element_location = element.location
            element_size = element.size

            center_x = element_location['x'] + int(element_size['width'] / 2)
            center_y = element_location['y'] + int(element_size['height'] / 2)

            element_coordinates = center_x, center_y

            self.save_element_image(element, image_name)

            Util.log_warning(('check element, found by selector',
                              selector, element_coordinates, time.time() - start_time))

            return element_coordinates

        except TimeoutException:
            Util.log_warning(('check element, not found', selector, time.time() - start_time))
            return None

    def _check_element_by_image(self, image_name):
        if image_name and self.image_recognition_enabled:
            start_time = time.time()
            element_coordinates = self.find_element_image_center(image_name)
            if element_coordinates:
                Util.log_warning(('check element, found by image',
                                  image_name, element_coordinates, time.time() - start_time))
                return element_coordinates

        return None
