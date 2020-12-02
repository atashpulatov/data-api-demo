from framework.driver.driver_factory import DriverFactory
from framework.pages_base.driver_send_keys import DriverSendKeys
from framework.pages_base.element_get import ElementGet
from framework.pages_base.element_get_using_parent import ElementGetUsingParent
from framework.util.config_util import ConfigUtil
from framework.util.image_util import ImageUtil
from framework.util.util import Util


class BasePage(ElementGet, ElementGetUsingParent, DriverSendKeys):
    def __init__(self):
        super().__init__()
        driver_type = ConfigUtil.get_driver_type()

        self.driver = DriverFactory().get_driver(driver_type)
        self.__image_util = ImageUtil()

    def log(self, obj):
        Util.log(obj)

    def log_warning(self, obj):
        Util.log_warning(obj)

    def log_error(self, obj):
        Util.log_error(obj)

    def pause(self, secs):
        Util.pause(secs)

    def log_page_source(self):
        self.log_error(self.driver.page_source)

    def take_debug_screenshots(self, element, file_name_prefix=ImageUtil.DEBUG_SCREENSHOT_FILE_NAME_PREFIX):
        """
        Takes screenshots of full screen and a given element for debug purposes.

        Screenshots are saved in ConfigUtil.get_image_recognition_screenshots_folder().

        :param element: Element to take screenshot.
        :param file_name_prefix: Debug file names prefix.
        """

        self.__image_util.take_debug_screenshots(element, file_name_prefix)
