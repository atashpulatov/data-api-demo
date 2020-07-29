from pages_base.base_page import BasePage
from util.const import ELEMENT_SEARCH_RETRY_NUMBER, DEFAULT_WAIT_AFTER_EXCEPTION
from util.exception.MstrException import MstrException


class BaseWindowsDesktopPage(BasePage):
    POPUP_MAIN_ELEMENT = 'MicroStrategy for Office'

    popup_main_element = None

    def get_popup_main_element(self):
        # if True or not BaseWindowsDesktopPage.popup_main_element:

        i = 0
        mstr_elems = None
        while i < ELEMENT_SEARCH_RETRY_NUMBER and not mstr_elems:
            mstr_elems = self.get_elements_by_name(BaseWindowsDesktopPage.POPUP_MAIN_ELEMENT)
            if not mstr_elems:
                self.log_warning('Element not found, try %s: %s' % (i, BaseWindowsDesktopPage.POPUP_MAIN_ELEMENT))
                self.pause(DEFAULT_WAIT_AFTER_EXCEPTION)

            i += 1

        if not mstr_elems:
            raise MstrException('Cannot find any elements: %s' % BaseWindowsDesktopPage.POPUP_MAIN_ELEMENT)

        BaseWindowsDesktopPage.popup_main_element = mstr_elems[0]

        return BaseWindowsDesktopPage.popup_main_element

    def prepare_image_name(self, image_name):
        return '%s_%s' % (self.__class__.__name__, image_name)
