from pyperclip import paste
from selenium.webdriver.common.keys import Keys

from framework.pages_base.windows_desktop_send_keys import WindowsDesktopSendKeys


class BaseWindowsDesktopPage(WindowsDesktopSendKeys):
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
