from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

from framework.driver.driver_factory import DriverFactory
from framework.util.const import Const
from framework.util.util import Util


class DriverSendKeys:
    def __init__(self):
        super().__init__()

        self.__driver = DriverFactory().get_driver()

    def press_right_arrow(self):
        self.send_keys(Keys.ARROW_RIGHT)

    def press_down_arrow(self):
        self.send_keys(Keys.ARROW_DOWN)

    def press_end(self):
        self.send_keys(Keys.END)

    def press_page_down(self):
        self.send_keys(Keys.PAGE_DOWN)

    def press_backspace(self):
        self.send_keys(Keys.BACKSPACE)

    def press_enter(self):
        self.send_keys(Keys.ENTER)

    def press_tab(self):
        self.send_keys(Keys.TAB)

    def press_escape(self):
        self.send_keys(Keys.ESCAPE)

    def press_home(self):
        self.send_keys(Keys.HOME)

    def send_keys(self, keys):
        ActionChains(self.__driver).send_keys(keys).perform()

        Util.pause(Const.AFTER_OPERATION_WAIT_TIME)
