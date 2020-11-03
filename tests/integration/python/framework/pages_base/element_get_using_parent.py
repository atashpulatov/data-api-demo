from framework.driver.driver_factory import DriverFactory
from framework.pages_base.element_coordinates import ElementCoordinates
from framework.pages_base.image_element import ImageElement
from framework.util.config_util import ConfigUtil
from framework.util.const import DEFAULT_TIMEOUT


class ElementGetUsingParent(ElementCoordinates):
    """
    Class providing methods for getting elements using a given parent element (relative search).

    It improves performance on Windows Desktop by allowing usage of image recognition in this scenario and helps
    to simplify Pages code.

    Concrete implementation of finding element is specified by each method's name,
    e.g. get_element_by_name_using_parent() uses self.get_element_center_coordinates_by_name_using_parent
    and parent_element.parent_element.get_element_by_name().

    Parameters for all get_element_by_*_using_parent() methods:

    parent_selection_method: Python method to used when searching for parent element.
    parent_selector: Selector to be used when searching for parent element, e.g. 'NUIDialog'.
    element_selector: Selector to be used when searching for element, e.g. 'Close'.
    image_name: Image name to store element's screenshot as.
    timeout: Timeout threshold in seconds, when reached throws TimeoutException (when image recognition is disabled)
    or MstrException (when image recognition is enabled).

    All get_element_by_*_using_parent() methods return found BaseElement (image recognition disabled)
    or ImageElement (image recognition enabled).

    Usage example:

    element = self.get_element_by_name_using_parent(
        self.get_element_by_class_name, ImportDataWindowsDesktopPage.POPUP_WINDOW_ELEM,
        ImportDataWindowsDesktopPage.POPUP_CLOSE_BUTTON,
        image_name=self.prepare_image_name(ImportDataWindowsDesktopPage.POPUP_CLOSE_BUTTON)
    )

    self.get_element_center_coordinates_by_*_using_parent methods should raise MstrException when element not present.
    """

    def __init__(self):
        super().__init__()

        driver_type = ConfigUtil.get_driver_type()
        self.driver = DriverFactory().get_driver(driver_type)

        self.image_recognition_enabled = ConfigUtil.is_image_recognition_enabled()

    def get_element_by_name_using_parent(self, parent_selection_method, parent_selector, element_selector,
                                         image_name=None, timeout=DEFAULT_TIMEOUT):
        if image_name and self.image_recognition_enabled:
            return self._get_image_element_using_parent(
                parent_selection_method, parent_selector,
                self.get_element_center_coordinates_by_name_using_parent, element_selector,
                image_name, timeout
            )
        else:
            parent_element = parent_selection_method(parent_selector, timeout=timeout)
            return parent_element.get_element_by_name(element_selector)

    def _get_image_element_using_parent(self, parent_selection_method, parent_selector,
                                        element_selection_method_image, element_selector,
                                        image_name=None, timeout=DEFAULT_TIMEOUT):
        cached_element_coordinates = self.image_util.get_element_center_coordinates_by_image(image_name)
        if cached_element_coordinates:
            return ImageElement(cached_element_coordinates, self.driver)

        parent_element = parent_selection_method(parent_selector, timeout=timeout)

        element_center_coordinates = element_selection_method_image(
            parent_element, element_selector, timeout, image_name
        )

        return ImageElement(element_center_coordinates, self.driver)
