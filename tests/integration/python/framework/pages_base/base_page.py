from framework.driver.driver_factory import DriverFactory
from framework.pages_base.driver_send_keys import DriverSendKeys
from framework.pages_base.element_get_using_parent import ElementGetUsingParent
from framework.pages_base.element_wait import ElementWait
from framework.util.image_util import ImageUtil
from framework.util.util import Util


class BasePage(ElementWait, ElementGetUsingParent, DriverSendKeys):
    def __init__(self):
        super().__init__()

        self.__image_util = ImageUtil()

    @property
    def driver(self):
        return DriverFactory().get_driver()

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

    def take_debug_screenshots(self, element=None, file_name_prefix=ImageUtil.DEBUG_SCREENSHOT_FILE_NAME_PREFIX):
        """
        Takes screenshots of full screen and a given element for debug purposes.

        When element is not given, only full screen screenshot is taken.

        Screenshots are saved in ConfigUtil.get_image_recognition_screenshots_folder().

        :param element: Element to take screenshot.
        :param file_name_prefix: Debug file names prefix.
        """

        self.__image_util.take_debug_screenshots(element, file_name_prefix)
