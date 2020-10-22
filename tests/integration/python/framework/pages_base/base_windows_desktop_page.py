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
