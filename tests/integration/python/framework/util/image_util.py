import os
import re
from io import BytesIO

from PIL import Image


class ImageUtil:
    CURRENT_SCREENSHOT_FILE_NAME = 'current_screenshot'

    SCREENSHOT_FOLDER = 'framework/screenshots'
    SCREENSHOT_FILE_EXTENSION = '.png'

    TO_ALPHA_REGEX = re.compile(r'\W')

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
        file_name_prefix_alpha = ImageUtil.TO_ALPHA_REGEX.sub('_', file_name_prefix)
        file_name = ''.join((file_name_prefix_alpha.lower(), ImageUtil.SCREENSHOT_FILE_EXTENSION))
        file_path = os.path.join(ImageUtil.SCREENSHOT_FOLDER, file_name)

        return file_path
