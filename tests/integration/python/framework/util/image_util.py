import hashlib
import os
import re
from io import BytesIO

from PIL import Image

from framework.util.config_util import ConfigUtil
from framework.util.exception.MstrException import MstrException


class ImageUtil:
    CURRENT_SCREENSHOT_FILE_NAME = 'current_screenshot'

    SCREENSHOT_FILE_EXTENSION = '.png'

    TO_ALPHA_REGEX = re.compile(r'\W')
    FILE_NAME_MAX_LENGTH = 100
    FILE_NAME_SEPARATOR = '_'

    def save_current_screenshot(self, driver):
        image = self._get_screenshot_image(driver)
        image.save(self.get_current_screenshot_path())

    def get_current_screenshot_path(self):
        return self.prepare_file_path(ImageUtil.CURRENT_SCREENSHOT_FILE_NAME)

    def save_element_image(self, driver, element, file_name_prefix):
        image = self._get_screenshot_image(driver)

        coordinates = self._calculate_cropped_coordinates(element)
        cropped_image = image.crop(coordinates)

        cropped_file_name = self.prepare_file_path(file_name_prefix)
        cropped_image.save(cropped_file_name)

    def _get_screenshot_image(self, driver):
        screenshot_png = driver.get_screenshot_as_png()

        return Image.open(BytesIO(screenshot_png))

    def _calculate_cropped_coordinates(self, element):
        element_location = element.location
        element_size = element.size

        left = element_location['x']
        top = element_location['y']
        right = left + element_size['width']
        bottom = top + element_size['height']

        return left, top, right, bottom

    def prepare_file_path(self, file_name_prefix):
        screenshots_folder = self._get_screenshots_folder()

        file_name_prefix_alpha = ImageUtil.TO_ALPHA_REGEX.sub('_', file_name_prefix)
        file_name_shortend = self._shorten_file_name(file_name_prefix_alpha)
        file_name = ''.join((file_name_shortend.lower(), ImageUtil.SCREENSHOT_FILE_EXTENSION))

        file_path = os.path.join(screenshots_folder, file_name)

        return file_path

    def _get_screenshots_folder(self):
        screenshots_folder = ConfigUtil.get_image_recognition_screenshots_folder()

        if not os.path.exists(screenshots_folder):
            raise MstrException(
                'Invalid image recognition screenshots folder name, folder does not exist '
                'or has wrong permissions: %s' % screenshots_folder
            )

        return screenshots_folder

    def _shorten_file_name(self, file_name):
        """
        Ensures the file name is no longer than FILE_NAME_MAX_LENGTH.

        If the file name is shorter or equals to FILE_NAME_MAX_LENGTH it returns the file_name.
        Otherwise it returns the trimmed file name with added hashed file_name.

        :param file_name(str): String containing the file name.

        :returns (str): Original file name or file name of limited length with added hashed file_name.
        """

        if len(file_name) <= ImageUtil.FILE_NAME_MAX_LENGTH:
            return file_name

        file_name_suffix = ImageUtil.FILE_NAME_SEPARATOR + hashlib.md5(file_name.encode()).hexdigest()
        file_name_prefix_length = ImageUtil.FILE_NAME_MAX_LENGTH - len(file_name_suffix)
        file_name_trimmed = file_name[0:file_name_prefix_length]

        return file_name_trimmed + file_name_suffix
