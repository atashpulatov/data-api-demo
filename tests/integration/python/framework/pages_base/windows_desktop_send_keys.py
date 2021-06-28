from selenium.webdriver.common.keys import Keys

from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.util.const import Const


class WindowsDesktopSendKeys(WindowsDesktopMainAddInElementCache):
    def send_keys_using_excel_element(self, keys):
        """
        Presses keys using main Excel element.

        Works when ActionChains(driver).send_keys() is not working as expected, e.g. press Alt, release Alt,
        press some keys (not: press Alt and holding it press some keys).

        :param keys: Keys to be pressed.
        """
        ImageElement.excel_element.send_keys(keys)

        self.pause(Const.AFTER_OPERATION_WAIT_TIME)

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

    def press_f5(self):
        self.send_keys(Keys.F5)

    def send_keys(self, keys):
        self.send_keys_using_excel_element(keys)
