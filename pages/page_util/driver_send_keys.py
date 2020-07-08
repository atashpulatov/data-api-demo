from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

from driver.driver_factory import DriverFactory
from util.config_util import ConfigUtil
from util.const import AFTER_OPERATION_WAIT_TIME
from util.util import Util


class DriverSendKeys:
    DEFAULT_IMAGE_TIMEOUT = 10

    def __init__(self):
        super().__init__()

        driver_type = ConfigUtil.get_driver_type()

        self.__driver = DriverFactory().get_driver(driver_type)

    def press_right_arrow(self):
        self.send_keys_raw(Keys.ARROW_RIGHT)

    def press_backspace(self):
        self.send_keys_raw(Keys.BACKSPACE)

    def press_enter(self):
        self.send_keys_raw(Keys.ENTER)

    def send_keys_raw(self, keys):
        ActionChains(self.__driver).send_keys(keys).perform()

        Util.pause(AFTER_OPERATION_WAIT_TIME)
