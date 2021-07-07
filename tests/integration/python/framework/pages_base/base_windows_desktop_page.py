from pyperclip import paste
from selenium.webdriver.common.keys import Keys

from framework.pages_base.windows_desktop_send_keys import WindowsDesktopSendKeys
from framework.util.exception.mstr_exception import MstrException


class BaseWindowsDesktopPage(WindowsDesktopSendKeys):
    MAIN_WINDOW_XPATH = '/Window'

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

    def get_current_window_name(self):
        current_window = self.get_element_by_xpath(BaseWindowsDesktopPage.MAIN_WINDOW_XPATH)

        return current_window.get_name_by_attribute()

    def switch_to_window_by_name(self, window_name):
        window_handles = self.driver.window_handles

        for window_handle in window_handles:
            self.driver.switch_to.window(window_handle)
            if self.get_current_window_name() == window_name:
                return

        raise MstrException(f'Could not find driver window with name: {window_name}')
