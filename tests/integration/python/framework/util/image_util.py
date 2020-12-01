import hashlib
import os
import re
import time
from io import BytesIO

import cv2
from PIL import Image
from selenium.common.exceptions import NoSuchElementException, TimeoutException
# from selenium.webdriver.support import expected_conditions as ec
# from selenium.webdriver.support.wait import WebDriverWait

from framework.driver.driver_factory import DriverFactory
from framework.util.config_util import ConfigUtil
from framework.util.const import DEFAULT_IMAGE_TIMEOUT, DEFAULT_WAIT_BETWEEN_CHECKS
from framework.util.const import DEFAULT_TIMEOUT
from framework.util.exception.MstrException import MstrException
from framework.util.image_data import ImageData
from framework.util.util import Util


class ImageUtil:
    """
    Class providing core methods for finding element's ImageData. Uses image recognition if enabled.
    """

    def __init__(self):
        super().__init__()

        driver_type = ConfigUtil.get_driver_type()

        self.driver = DriverFactory().get_driver(driver_type)

        self.image_recognition_enabled = ConfigUtil.is_image_recognition_enabled()

    CURRENT_SCREENSHOT_FILE_NAME = 'current_full_screenshot'

    SCREENSHOT_FILE_EXTENSION = '.png'

    TO_ALPHA_REGEX = re.compile(r'\W')
    FILE_NAME_MAX_LENGTH = 100
    FILE_NAME_SEPARATOR = '_'

    RGB_TO_HEX_PATTERN = '#{:x}{:x}{:x}'

    def get_image_data_by_image_name(self, image_name):
        """
        Gets element's ImageData using image recognition.

        Returns element's ImageData (see ImageData for details) when image recognition is globally enabled,
        image given by image_name is present in cache, and is currently visible on screen,

        or

        None when image recognition is disabled globally, image_name is empty, or image is currently not
        present on screen.

        Note: data of THE FIRST matching element is returned.

        :param image_name: Name of image stored in images cache.

        :return: Element's ImageData or None.
        """
        if image_name and self.image_recognition_enabled:
            image = self._get_element_gray_image(image_name)
            coordinates = self._get_element_corners_coordinates_by_image(image, image_name)

            if coordinates is not None:
                return ImageData(image, image_name, coordinates)

        return None

    def get_image_data_and_save_image(self, selector_type, selector,
                                      timeout, image_name, parent_element=None):
        """
        Gets element's ImageData and saves its image (if image recognition is enabled).

        Supports relative search when parent_element is provided.

        Image recognition is enabled when enabled globally (self.image_recognition_enabled is True) and for this
        element (image_name is not empty).

        :param selector_type: Selector type to be used when searching for an element, e.g. By.NAME.
        :param selector: Selector to be used when searching for an element, e.g. 'Close'.
        :param timeout: Timeout threshold in seconds, when reached None is returned.
        :param image_name: Image name to store element's screenshot as.
        :param parent_element: Parent element to start relative search from, if not provided - use absolute search.

        :return: ImageData found using selector_type and selector or None if not found.
        """

        self.driver.implicitly_wait(timeout)

        start_time = time.time()

        # TODO to be removed if not needed
        # wait = WebDriverWait(self.driver, timeout)

        try:
            # TODO to be removed if not needed
            # wait.until(ec.visibility_of_element_located((selector_type, selector)))

            if parent_element:
                element = parent_element.get_element(selector_type, selector, timeout)
            else:
                element = self.driver.find_element(selector_type, selector)

            element_coordinates = self._calculate_element_coordinates(element)

            element_image = self.get_element_image(element)
            self._save_element_image(element_image, image_name)

            Util.log(f'Element found by selector: [{selector}], name: [{image_name}], '
                     f'coordinates: [{element_coordinates}], time: [{time.time() - start_time}]')

            return ImageData(element_image, image_name, element_coordinates)

        except NoSuchElementException:
            pass

        except TimeoutException:
            pass

        self.driver.implicitly_wait(DEFAULT_TIMEOUT)

        Util.log(f'Element not found by selector: [{selector}], time: [{time.time() - start_time}]')

        return None

    def _get_element_corners_coordinates_by_image(self, image, image_name):
        """
        Gets element corners coordinates using image recognition.

        Returns element corners coordinates (left, top, right, bottom) when image recognition is globally enabled,
        image given by image_name is present in cache, and is currently visible on screen

        or

        None when image recognition is disabled globally, image_name is empty, or image is currently not
        present on screen.

        :param: image: Image to search for.
        :param: image_name: Name of image stored in images cache, used for logging.

        :return: Element's corners coordinates (left, top, right, bottom) or None.
        """
        if image is not None and self.image_recognition_enabled:
            element_coordinates = self._find_element_image_corners_coordinates(image, image_name)
            if element_coordinates:
                return element_coordinates

        return None

    def _find_element_image_corners_coordinates(self, image, image_name):
        if image is None:
            return None

        end_time = time.time() + DEFAULT_IMAGE_TIMEOUT
        i = 1

        while end_time > time.time():
            Util.log(f'Looking for image, name: [{image_name}], try: {i}.')

            current_full_screen_gray_image = self._get_current_full_screen_gray_image()

            coordinates = self._search_for_element_image_in_full_screen(
                current_full_screen_gray_image,
                image
            )

            if coordinates:
                Util.log(f'Element found by image, name: [{image_name}], coordinates: [{coordinates}], '
                         f'time: [{end_time - time.time()}]')

                return coordinates

            Util.pause(DEFAULT_WAIT_BETWEEN_CHECKS)
            i += 1

        Util.log(f'Image not found, name: [{image_name}], tries: {i - 1}, timeout: [{end_time - time.time()}].')

        return None

    def _get_element_gray_image(self, element_image_name):
        element_image_file_path = self._prepare_image_file_path(element_image_name)

        if os.path.exists(element_image_file_path):
            return self._get_gray_image(element_image_file_path)

        return None

    def _get_current_full_screen_gray_image(self):
        current_full_screen_file_path = self._save_current_full_screen()

        return self._get_gray_image(current_full_screen_file_path)

    def _get_gray_image(self, image_path):
        color_image = cv2.imread(image_path)

        return cv2.cvtColor(color_image, cv2.COLOR_BGR2GRAY)

    def _search_for_element_image_in_full_screen(self, current_full_screen_gray_image, element_gray_image):
        result = cv2.matchTemplate(current_full_screen_gray_image, element_gray_image, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(result)

        if max_val > 0.99:
            left = max_loc[0]
            top = max_loc[1]
            right = left + element_gray_image.shape[1]
            bottom = top + element_gray_image.shape[0]

            return {
                'left': left,
                'top': top,
                'right': right,
                'bottom': bottom
            }

        return None

    def _save_current_full_screen(self):
        current_full_screen_file_path = self._prepare_image_file_path(ImageUtil.CURRENT_SCREENSHOT_FILE_NAME)

        image = self._get_full_screen_image()
        image.save(current_full_screen_file_path)

        return current_full_screen_file_path

    def _save_element_image(self, element_image, file_name_prefix):
        if file_name_prefix and self.image_recognition_enabled:
            element_file_name = self._prepare_image_file_path(file_name_prefix)

            element_image.save(element_file_name)

    def get_element_image(self, element):
        screenshot_image = self._get_full_screen_image()

        coordinates = self._calculate_element_coordinates(element)

        return screenshot_image.crop(
            (coordinates['left'], coordinates['top'], coordinates['right'], coordinates['bottom'])
        )

    def _get_full_screen_image(self):
        screenshot_png = self.driver.get_screenshot_as_png()

        return Image.open(BytesIO(screenshot_png))

    def _calculate_element_coordinates(self, element):
        element_location = element.location
        element_size = element.size

        left = element_location['x']
        top = element_location['y']
        right = left + element_size['width']
        bottom = top + element_size['height']

        return {
            'left': left,
            'top': top,
            'right': right,
            'bottom': bottom
        }

    def _prepare_image_file_path(self, file_name_prefix):
        screenshots_folder = self._get_screenshots_folder()

        file_name_prefix_alpha = ImageUtil.TO_ALPHA_REGEX.sub('_', file_name_prefix)
        file_name_shortend = self._shorten_file_name(file_name_prefix_alpha)
        file_name = ''.join((file_name_shortend.lower(), ImageUtil.SCREENSHOT_FILE_EXTENSION))

        file_path = os.path.join(screenshots_folder, file_name)

        return file_path

    def _get_screenshots_folder(self):
        screenshots_folder = ConfigUtil.get_image_recognition_screenshots_folder()

        if os.path.exists(screenshots_folder):
            return screenshots_folder

        raise MstrException(
            'Invalid image recognition screenshots folder name, folder does not exist '
            f'or has wrong permissions: [{screenshots_folder}].'
        )

    def _shorten_file_name(self, file_name):
        """
        Ensures the file name is no longer than FILE_NAME_MAX_LENGTH.

        If the file name is shorter or equals to FILE_NAME_MAX_LENGTH, it returns the file_name.
        Otherwise it returns the trimmed file name with added hashed file_name.

        :param file_name(str): String containing the file name.

        :returns (str): Original file name or file name of limited length with added hashed file_name.
        """

        if len(file_name) <= ImageUtil.FILE_NAME_MAX_LENGTH:
            return file_name

        file_name_suffix = ImageUtil.FILE_NAME_SEPARATOR + hashlib.md5(file_name.encode()).hexdigest()
        file_name_prefix_length = ImageUtil.FILE_NAME_MAX_LENGTH - len(file_name_suffix)
        file_name_prefix = file_name[0:file_name_prefix_length]

        return file_name_prefix + file_name_suffix

    def get_color_from_image(self, image, offset_x, offset_y):
        """
        Gets color from image, using coordinates relative to left top corner (0, 0).
        :param image: Image to check color in.
        :param offset_x: X coordinate to pick color from.
        :param offset_y: Y coordinate to pick color from.

        :return: Color as a hex string, e.g. '#ffaac1'.
        """
        color = image.getpixel((offset_x, offset_y))

        hex_color = ImageUtil.RGB_TO_HEX_PATTERN.format(*color)

        return hex_color
