from pages.base_page import BasePage
from util.util import Util


class CleanupWindowsDesktopPage(BasePage):
    CLOSE_BUTTON_ELEM = 'Close'
    DONT_SAVE_BUTTON_ELEM = "Don't Save"

    def clean_up_after_each_test(self):
        self.click_element_by_name(CleanupWindowsDesktopPage.CLOSE_BUTTON_ELEM,
                                   image_name=self.prepare_image_name(CleanupWindowsDesktopPage.CLOSE_BUTTON_ELEM))

        self.click_element_by_name(CleanupWindowsDesktopPage.DONT_SAVE_BUTTON_ELEM,
                                   image_name=self.prepare_image_name(CleanupWindowsDesktopPage.DONT_SAVE_BUTTON_ELEM))

        Util.pause(3)
