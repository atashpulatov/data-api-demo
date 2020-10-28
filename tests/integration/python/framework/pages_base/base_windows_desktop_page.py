from pyperclip import paste
from selenium.webdriver.common.keys import Keys

from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache
from framework.util.const import AFTER_OPERATION_WAIT_TIME


class BaseWindowsDesktopPage(WindowsDesktopMainAddInElementCache):
    def send_keys_using_excel_element(self, keys):
        """
        Presses keys using main Excel element.

        Works when ActionChains(driver).send_keys() is not working as expected, e.g. press Alt, release Alt,
        press some keys (not: press Alt and holding it press some keys).

        :param keys: Keys to be pressed.
        """
        ImageElement.excel_element.send_keys(keys)

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def prepare_image_name(self, image_name):
        return '%s_%s' % (self.__class__.__name__, image_name)

    def get_selected_text_using_clipboard(self):
        """
        Gets selected text (e.g. by previous ctrl-a or double click) using OS clipboard.

        It requires running and executing test on the same machine (no remote test execution),
        since it uses local machine's clipboard.

        :return (str): Selected text.
        """

        self.send_keys(Keys.CONTROL + 'c')
        self.send_keys(Keys.CONTROL)

        return paste()
