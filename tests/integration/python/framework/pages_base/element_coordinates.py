from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By

from framework.util.const import DEFAULT_TIMEOUT
from framework.util.image_util import ImageUtil


class ElementCoordinates:
    """
    Class providing methods for finding element center's coordinates. If enabled, all methods use image recognition.

    Concrete implementation of finding element is specified by each method's name,
    e.g. get_element_center_coordinates_by_name() uses By.NAME.

    Two sets of methods are available:

    get_element_center_coordinates_by_*() and get_element_center_coordinates_by_*_using_parent().

    Methods get_element_center_coordinates_by_*() use absolute search and are generally slower, usage example:

    element = self.get_element_center_coordinates_by_name(selector).

    Methods get_element_center_coordinates_by_*_using_parent() use relative search and are generally faster, but require
    providing a parent element, usage example:

    element = self.get_element_center_coordinates_by_name_using_parent(parent_element, selector)
    """

    def __init__(self):
        super().__init__()

        self.image_util = ImageUtil()

    def get_element_center_coordinates_by_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates(By.NAME, selector, image_name, timeout)

    def get_element_center_coordinates_by_css(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates(By.CSS_SELECTOR, selector, image_name, timeout)

    def get_element_center_coordinates_by_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates(By.ID, selector, image_name, timeout)

    def get_element_center_coordinates_by_mobile_accessibility_id(self, selector, timeout=DEFAULT_TIMEOUT,
                                                                  image_name=None):
        return self._get_element_center_coordinates(MobileBy.ACCESSIBILITY_ID, selector, image_name, timeout)

    def get_element_center_coordinates_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates(By.XPATH, selector, image_name, timeout)

    def get_element_center_coordinates_by_class_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates(By.CLASS_NAME, selector, image_name, timeout)

    def get_element_center_coordinates_by_tag_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates(By.TAG_NAME, selector, image_name, timeout)

    def _get_element_center_coordinates(self, selector_type, selector, image_name, timeout):
        element_coordinates = self.image_util.get_element_center_coordinates_by_image(image_name)
        if element_coordinates:
            return element_coordinates

        return self.image_util.get_element_coordinates_and_save_image(selector_type, selector, image_name, timeout)

    def get_element_center_coordinates_by_name_using_parent(self, parent_element, selector,
                                                            timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.image_util.get_element_coordinates_and_save_image(
            By.NAME, selector, image_name, timeout, parent_element
        )

    def get_element_center_coordinates_by_css_using_parent(self, parent_element, selector,
                                                           timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.image_util.get_element_coordinates_and_save_image(
            By.CSS_SELECTOR, selector, image_name, timeout, parent_element
        )

    def get_element_center_coordinates_by_id_using_parent(self, parent_element, selector,
                                                          timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.image_util.get_element_coordinates_and_save_image(
            By.ID, selector, image_name, timeout, parent_element
        )

    def get_element_center_coordinates_by_mobile_accessibility_id_using_parent(self, parent_element, selector,
                                                                               timeout=DEFAULT_TIMEOUT,
                                                                               image_name=None):
        return self.image_util.get_element_coordinates_and_save_image(
            MobileBy.ACCESSIBILITY_ID, selector, image_name, timeout, parent_element
        )

    def get_element_center_coordinates_by_xpath_using_parent(self, parent_element, selector,
                                                             timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.image_util.get_element_coordinates_and_save_image(
            By.XPATH, selector, image_name, timeout, parent_element
        )

    def get_element_center_coordinates_by_class_name_using_parent(self, parent_element, selector,
                                                                  timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.image_util.get_element_coordinates_and_save_image(
            By.CLASS_NAME, selector, image_name, timeout, parent_element
        )

    def get_element_center_coordinates_by_tag_name_using_parent(self, parent_element, selector,
                                                                timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.image_util.get_element_coordinates_and_save_image(
            By.TAG_NAME, selector, image_name, timeout,
            parent_element
        )
