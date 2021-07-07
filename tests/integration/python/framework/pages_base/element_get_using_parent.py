from framework.driver.driver_factory import DriverFactory
from framework.pages_base.element_info import ElementInfo
from framework.pages_base.image_element import ImageElement
from framework.util.config_util import ConfigUtil
from framework.util.const import Const


class ElementGetUsingParent(ElementInfo):
    """
    Class providing methods for getting elements using a given parent element (relative search).

    It improves performance on Windows Desktop by allowing usage of image recognition in this scenario and helps
    to simplify Pages code.

    Concrete implementation of finding element is specified by each method's name,
    e.g. get_element_by_name_using_parent() uses self.get_element_info_by_name_using_parent
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

    self.get_element_info_by_*_using_parent methods should raise MstrException when element not present.
    """

    def __init__(self):
        super().__init__()

        self.image_recognition_enabled = ConfigUtil.is_image_recognition_enabled()

    @property
    def driver(self):
        return DriverFactory().get_driver()

    def get_element_by_name_using_parent(self, parent_selection_method, parent_selector, element_selector,
                                         image_name=None, timeout=Const.DEFAULT_TIMEOUT):
        if image_name and self.image_recognition_enabled:
            return self._get_image_element_using_parent(
                parent_selection_method, parent_selector,
                self.get_element_info_by_name_using_parent, element_selector,
                image_name, timeout
            )
        else:
            parent_element = parent_selection_method(parent_selector, timeout=timeout)
            return parent_element.get_element_by_name(element_selector)

    def _get_image_element_using_parent(self, parent_selection_method, parent_selector,
                                        element_selection_method_image, element_selector,
                                        image_name=None, timeout=Const.DEFAULT_TIMEOUT):
        image_data_cached = self.image_util.get_image_data_by_image_name(image_name)

        if image_data_cached is not None:
            return ImageElement(image_data_cached, self.driver)

        parent_element = parent_selection_method(parent_selector, timeout=timeout)

        image_data_by_selector = element_selection_method_image(
            parent_element, element_selector, timeout, image_name
        )

        return ImageElement(image_data_by_selector, self.driver)
