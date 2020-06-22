import os
import time

import cv2
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By

from driver.driver_factory import DriverFactory
from util.config_util import ConfigUtil
from util.const import DEFAULT_WAIT_BETWEEN_CHECKS, DEFAULT_IMAGE_TIMEOUT, AFTER_OPERATION_WAIT_TIME
from util.image_util import ImageUtil
from util.util import Util


class ElementOperation:
    excel_element = None

    def __init__(self):
        driver_type = ConfigUtil.get_driver_type()

        self.driver = DriverFactory().get_driver(driver_type)

        self.image_recognition_enabled = ConfigUtil.is_image_recognition_enabled()

    @classmethod
    def reset_excel_root_element(cls, driver, root_element='Excel'):
        ElementOperation.excel_element = driver.find_element(By.NAME, root_element)

    @classmethod
    def click_excel_root_element(cls):
        ElementOperation.excel_element.click()

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def find_element_image_center(self, image_name, timeout=DEFAULT_IMAGE_TIMEOUT):
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

    def save_element_image(self, element, image_name):
        if image_name and self.image_recognition_enabled:
            ImageUtil().save_element_image(self.driver, element, image_name)

    def move_to_coordinates(self, coordinates, offset_x=0, offset_y=0):
        (ActionChains(self.driver)
         .move_to_element_with_offset(ElementOperation.excel_element,
                                      coordinates[0] + offset_x,
                                      coordinates[1] + offset_y)
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def click_coordinates(self, coordinates, offset_x=0, offset_y=0):
        (ActionChains(self.driver)
         .move_to_element_with_offset(ElementOperation.excel_element,
                                      coordinates[0] + offset_x,
                                      coordinates[1] + offset_y)
         .click()
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)
