from selenium.common.exceptions import NoSuchElementException

from pages.base_page import BasePage
from pages.page_util.base_element import BaseElement
from util.const import ELEMENT_SEARCH_RETRY_NUMBER, DEFAULT_WAIT_AFTER_EXCEPTION
from util.exception.MstrException import MstrException


class BaseWindowsDesktopPage(BasePage):
    POPUP_MAIN_ELEMENT = 'MicroStrategy for Office'
    NAME_ATTRIBUTE = 'Name'

    popup_main_element = None

    def get_popup_main_element(self):
        if True or not BaseWindowsDesktopPage.popup_main_element:

            i = 0
            mstr_elems = None
            while i < ELEMENT_SEARCH_RETRY_NUMBER and not mstr_elems:
                mstr_elems = self.get_elements_by_name(BaseWindowsDesktopPage.POPUP_MAIN_ELEMENT)
                if not mstr_elems:
                    self.log_warning('Element not found, try %s: %s' % (i, BaseWindowsDesktopPage.POPUP_MAIN_ELEMENT))
                    self.pause(DEFAULT_WAIT_AFTER_EXCEPTION)

                i += 1

            if not mstr_elems:
                raise MstrException('Cannot find any element: %s' % BaseWindowsDesktopPage.POPUP_MAIN_ELEMENT)

            BaseWindowsDesktopPage.popup_main_element = mstr_elems[0]

        return BaseWindowsDesktopPage.popup_main_element

    def find_element_by_xpath_from_parent(self, parent_element, selector):
        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            try:
                return BaseElement(parent_element.find_element_by_xpath(selector), self.driver)
            except NoSuchElementException:
                self.log_warning('Element not found, try %s: %s' % (i, selector))
                self.pause(5)
            i += 1

        raise MstrException('Cannot find element: %s' % selector)

    def find_elements_by_xpath_from_parent(self, parent_element, selector):
        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            try:
                raw_elements = parent_element.find_elements_by_xpath(selector)
                return BaseElement.wrap_raw_elements(raw_elements, self.driver)

            except NoSuchElementException:
                self.log_warning('Element not found, try %s: %s' % (i, selector))
                self.pause(5)
            i += 1

        raise MstrException('Cannot find elements: %s' % selector)

    def get_element_name(self, element):
        return element.get_attribute(BaseWindowsDesktopPage.NAME_ATTRIBUTE)

    def prepare_image_name(self, image_name):
        return '%s_%s' % (self.__class__.__name__, image_name)
