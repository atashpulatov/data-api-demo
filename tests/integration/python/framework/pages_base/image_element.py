from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By

from framework.pages_base.base_element import BaseElement
from framework.util.const import AFTER_OPERATION_WAIT_TIME
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class ImageElement(BaseElement):
    EXCEL_ROOT_ELEMENT = 'Excel'

    excel_element = None

    def __init__(self, center_coordinates, driver):
        super().__init__(None, driver)
        self.__center_coordinates = center_coordinates
        self.__driver = driver

    @classmethod
    def reset_excel_root_element(cls, driver, root_element=EXCEL_ROOT_ELEMENT):
        ImageElement.excel_element = BaseElement(driver.find_element(By.NAME, root_element), driver)

    def click(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__center_coordinates[0] + offset_x,
                                      self.__center_coordinates[1] + offset_y)
         .click()
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def double_click(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__center_coordinates[0] + offset_x,
                                      self.__center_coordinates[1] + offset_y)
         .double_click()
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def right_click(self):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__center_coordinates[0],
                                      self.__center_coordinates[1])
         .context_click()
         .perform())

    @property
    def id(self):
        raise MstrException('Invalid usage of ImageElement, id is not allowed')

    def clear(self):
        raise MstrException('Invalid usage of ImageElement, clear() is not allowed')

    @property
    def text(self):
        raise MstrException('Invalid usage of ImageElement, text is not allowed')

    def get_attribute(self, attribute_name):
        raise MstrException('Invalid usage of ImageElement, get_attribute() is not allowed')

    def get_name_by_attribute(self):
        raise MstrException('Invalid usage of ImageElement, get_name_by_attribute() is not allowed')

    def get_element_by_css(self, selector):
        raise MstrException('Invalid usage of ImageElement, get_element_by_css() is not allowed')

    def get_element_by_xpath(self, selector):
        raise MstrException('Invalid usage of ImageElement, get_element_by_xpath() is not allowed')

    def get_elements_by_name(self, selector):
        raise MstrException('Invalid usage of ImageElement, get_elements_by_css() is not allowed')

    def get_elements_by_css(self, selector):
        raise MstrException('Invalid usage of ImageElement, get_elements_by_css() is not allowed')

    def get_elements_by_xpath(self, selector):
        raise MstrException('Invalid usage of ImageElement, get_elements_by_xpath() is not allowed')

    def value_of_css_property(self, property_name):
        raise MstrException('Invalid usage of ImageElement, value_of_css_property() is not allowed')

    def move_to(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__center_coordinates[0] + offset_x,
                                      self.__center_coordinates[1] + offset_y)
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    @property
    def size(self):
        raise MstrException('Invalid usage of ImageElement, size is not allowed')

    @property
    def location(self):
        raise MstrException('Invalid usage of ImageElement, location is not allowed')

    def send_keys(self, special_key):
        raise MstrException('Invalid usage of ImageElement, send_keys() is not allowed')

    def send_keys_with_check(self, text):
        raise MstrException('Invalid usage of ImageElement, send_keys_with_check() is not allowed')
