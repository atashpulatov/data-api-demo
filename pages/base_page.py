from driver.driver_factory import DriverFactory
from pages.page_util.element_check import ElementCheck
from pages.page_util.element_get import ElementGet
from util.config_util import ConfigUtil
from util.util import Util


class BasePage(ElementGet, ElementCheck):
    def __init__(self):
        super().__init__()
        driver_type = ConfigUtil.get_driver_type()

        self.driver = DriverFactory().get_driver(driver_type)

    def log(self, obj):
        Util.log(obj)

    def log_warning(self, obj):
        Util.log_warning(obj)

    def log_error(self, obj):
        Util.log_error(obj)

    def pause(self, secs):
        Util.pause(secs)
