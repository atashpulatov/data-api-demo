from pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from util.util import Util


class CleanupWindowsDesktopPage(BaseWindowsDesktopPage):
    CLOSE_BUTTON_ELEM = 'Close'
    DONT_SAVE_BUTTON_ELEM = "Don't Save"

    def clean_up_after_each_test(self):
        self.get_element_by_name(
            CleanupWindowsDesktopPage.CLOSE_BUTTON_ELEM,
            image_name=self.prepare_image_name(CleanupWindowsDesktopPage.CLOSE_BUTTON_ELEM)
        ).click()

        self.get_element_by_name(
            CleanupWindowsDesktopPage.DONT_SAVE_BUTTON_ELEM,
            image_name=self.prepare_image_name(CleanupWindowsDesktopPage.DONT_SAVE_BUTTON_ELEM)
        ).click()

        Util.pause(3)
