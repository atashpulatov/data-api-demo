from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By

from framework.util.const import DEFAULT_TIMEOUT
from framework.util.exception.MstrException import MstrException
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

    When safe = True, all get_element_center_coordinates_by_*() methods return None when element is not present when,
    when safe = False, those methods raise MstrException when element is not present (default behavior).
    """

    def __init__(self):
        super().__init__()

        self.image_util = ImageUtil()

    def get_element_center_coordinates_by_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_center_coordinates(By.NAME, selector, timeout, image_name, safe)

    def get_element_center_coordinates_by_css(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_center_coordinates(By.CSS_SELECTOR, selector, timeout, image_name, safe)

    def get_element_center_coordinates_by_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_center_coordinates(By.ID, selector, timeout, image_name, safe)

    def get_element_center_coordinates_by_mobile_accessibility_id(self, selector, timeout=DEFAULT_TIMEOUT,
                                                                  image_name=None, safe=False):
        return self._get_element_center_coordinates(MobileBy.ACCESSIBILITY_ID, selector, timeout, image_name, safe)

    def get_element_center_coordinates_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None, safe=False):
        return self._get_element_center_coordinates(By.XPATH, selector, timeout, image_name, safe)

    def get_element_center_coordinates_by_class_name(self, selector, timeout=DEFAULT_TIMEOUT,
                                                     image_name=None, safe=False):
        return self._get_element_center_coordinates(By.CLASS_NAME, selector, timeout, image_name, safe)

    def get_element_center_coordinates_by_tag_name(self, selector, timeout=DEFAULT_TIMEOUT,
                                                   image_name=None, safe=False):
        return self._get_element_center_coordinates(By.TAG_NAME, selector, timeout, image_name, safe)

    def _get_element_center_coordinates(self, selector_type, selector, timeout, image_name, safe):
        element_coordinates = self.image_util.get_element_center_coordinates_by_image(image_name)
        if element_coordinates:
            return element_coordinates

        return self._get_element_center_coordinates_using_parent(selector_type, selector, timeout,
                                                                 image_name, None, safe)

    def get_element_center_coordinates_by_name_using_parent(self, parent_element, selector,
                                                            timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates_using_parent(By.NAME, selector, timeout, image_name, parent_element)

    def get_element_center_coordinates_by_css_using_parent(self, parent_element, selector,
                                                           timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates_using_parent(
            By.CSS_SELECTOR, selector, timeout, image_name, parent_element
        )

    def get_element_center_coordinates_by_id_using_parent(self, parent_element, selector,
                                                          timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates_using_parent(By.ID, selector, timeout, image_name, parent_element)

    def get_element_center_coordinates_by_mobile_accessibility_id_using_parent(self, parent_element, selector,
                                                                               timeout=DEFAULT_TIMEOUT,
                                                                               image_name=None):
        return self._get_element_center_coordinates_using_parent(
            By.ACCESSIBILITY_ID, selector, timeout, image_name, parent_element
        )

    def get_element_center_coordinates_by_xpath_using_parent(self, parent_element, selector,
                                                             timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates_using_parent(
            By.XPATH, selector, timeout, image_name, parent_element
        )

    def get_element_center_coordinates_by_class_name_using_parent(self, parent_element, selector,
                                                                  timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates_using_parent(
            By.CLASS_NAME, selector, timeout, image_name, parent_element
        )

    def get_element_center_coordinates_by_tag_name_using_parent(self, parent_element, selector,
                                                                timeout=DEFAULT_TIMEOUT, image_name=None):
        return self._get_element_center_coordinates_using_parent(
            By.TAG_NAME, selector, timeout, image_name, parent_element
        )

    def _get_element_center_coordinates_using_parent(self, selector_type, selector,
                                                     timeout, image_name, parent_element, safe=False):
        element_center_coordinates = self.image_util.get_element_center_coordinates_and_save_image(
            selector_type, selector, timeout, image_name, parent_element
        )

        if not safe and element_center_coordinates is None:
            raise MstrException(f'No element found using selector_type: [{selector_type}], selector: [{selector}], '
                                f'image_name: [{image_name}], timeout: [{timeout}], '
                                f'parent_element: [{parent_element}].')

        return element_center_coordinates
