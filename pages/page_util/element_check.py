import os
import time

import cv2
from appium.webdriver.common.mobileby import MobileBy
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from driver.driver_factory import DriverFactory
from util.config_util import ConfigUtil
from util.const import DEFAULT_TIMEOUT
from util.const import DEFAULT_WAIT_BETWEEN_CHECKS
from util.image_util import ImageUtil
from util.util import Util


class ElementCheck:
    DEFAULT_IMAGE_TIMEOUT = 10

    def __init__(self):
        super().__init__()
        driver_type = ConfigUtil.get_driver_type()

        self.driver = DriverFactory().get_driver(driver_type)

        self.image_recognition_enabled = ConfigUtil.is_image_recognition_enabled()

    def check_if_element_exists_by_name(self, selector):
        return self.get_element_coordinates_by_name(selector) is not None

    def get_element_coordinates_by_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_coordinates(By.NAME, selector, timeout, image_name)

    def get_element_coordinates_by_mobile_accessibility_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_coordinates(MobileBy.ACCESSIBILITY_ID, selector, timeout, image_name)

    def get_element_coordinates_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_coordinates(By.XPATH, selector, timeout, image_name)

    def _get_element_coordinates(self, selector_type, selector, timeout, image_name):
        element_coordinates = self._get_element_coordinates_by_image(image_name)
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

            self._save_element_image(element, image_name)

            Util.log_warning(('check element, found by selector',
                              selector, element_coordinates, time.time() - start_time))

            return element_coordinates

        except TimeoutException:
            Util.log_warning(('check element, not found', selector, time.time() - start_time))
            return None

    def _get_element_coordinates_by_image(self, image_name):
        if image_name and self.image_recognition_enabled:
            start_time = time.time()
            element_coordinates = self._find_element_image_center(image_name)
            if element_coordinates:
                Util.log_warning(('check element, found by image',
                                  image_name, element_coordinates, time.time() - start_time))
                return element_coordinates

        return None

    def _save_element_image(self, element, image_name):
        if image_name and self.image_recognition_enabled:
            ImageUtil().save_element_image(self.driver, element, image_name)

    def _find_element_image_center(self, image_name, timeout=DEFAULT_IMAGE_TIMEOUT):
        image_util = ImageUtil()

        cropped_image_file_path = image_util.prepare_file_path(image_name)

        if os.path.exists(cropped_image_file_path):
            small = cv2.imread(cropped_image_file_path)
            small_gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)

            end_time = time.time() + timeout
            i = 1
            while True:
                image_util.save_current_screenshot(self.driver)
                full_image_file_path = image_util.get_current_screenshot_path()
                big = cv2.imread(full_image_file_path)
                big_gray = cv2.cvtColor(big, cv2.COLOR_BGR2GRAY)

                res = cv2.matchTemplate(big_gray, small_gray, cv2.TM_CCOEFF_NORMED)
                min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

                if max_val > 0.99:
                    height, width, _ = small.shape
                    x = max_loc[0] + int(width / 2)
                    y = max_loc[1] + int(height / 2)
                    return x, y

                Util.pause(DEFAULT_WAIT_BETWEEN_CHECKS)
                i += 1

                if time.time() > end_time:
                    break

                Util.log_warning('Looking for image %s, try: %s' % (image_name, i))

            Util.log_warning('Image not found image %s, try: %s' % (image_name, i))

        return None
