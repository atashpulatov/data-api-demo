from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

from framework.driver.driver_factory import DriverFactory
from framework.util.const import Const
from framework.util.util import Util


class DriverSendKeys:
    def __init__(self):
        super().__init__()

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
        driver = DriverFactory().get_driver()

        ActionChains(driver).send_keys(keys).perform()

        Util.pause(Const.AFTER_OPERATION_WAIT_TIME)

    def hold_shift_and_press_keys(self, keys):
        self._execute_hold_modifier_and_press_keys(Keys.LEFT_SHIFT, keys)

    def hold_ctrl_and_press_keys(self, keys):
        self._execute_hold_modifier_and_press_keys(Keys.CONTROL, keys)

    def hold_command_and_press_keys(self, keys):
        self._execute_hold_modifier_and_press_keys(Keys.COMMAND, keys)

    def _execute_hold_modifier_and_press_keys(self, modifier_key, keys):
        driver = DriverFactory().get_driver()

        (ActionChains(driver)
         .key_down(modifier_key)
         .send_keys(keys)
         .key_up(modifier_key)
         .perform())

        Util.pause(Const.AFTER_OPERATION_WAIT_TIME)
