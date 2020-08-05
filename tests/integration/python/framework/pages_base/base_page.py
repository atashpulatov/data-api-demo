from framework.driver.driver_factory import DriverFactory
from framework.pages_base.driver_send_keys import DriverSendKeys
from framework.pages_base.element_get import ElementGet
from framework.util.config_util import ConfigUtil
from framework.util.util import Util


class BasePage(ElementGet, DriverSendKeys):
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
