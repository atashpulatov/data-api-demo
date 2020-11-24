from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By

from framework.pages_base.base_element import BaseElement
from framework.util.const import AFTER_OPERATION_WAIT_TIME
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class ImageElement(BaseElement):
    EXCEL_ROOT_ELEMENT = 'Excel'

    excel_element = None

    def __init__(self, image_name, corners_coordinates, image, driver):
        super().__init__(None, driver)
        self.__image_name = image_name
        self.__corners_coordinates = corners_coordinates
        self.__image = image
        self.__driver = driver

    @classmethod
    def reset_excel_root_element(cls, driver, root_element=EXCEL_ROOT_ELEMENT):
        ImageElement.excel_element = BaseElement(driver.find_element(By.NAME, root_element), driver)

    def click(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.center_coordinates[0] + offset_x,
                                      self.center_coordinates[1] + offset_y)
         .click()
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def double_click(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.center_coordinates[0] + offset_x,
                                      self.center_coordinates[1] + offset_y)
         .double_click()
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def right_click(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__center_coordinates[0] + offset_x,
                                      self.__center_coordinates[1] + offset_y)
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

    def get_automation_id_by_attribute(self):
        raise MstrException('Invalid usage of ImageElement, get_automation_id_by_attribute() is not allowed')

    def is_offscreen_by_attribute(self):
        raise MstrException('Invalid usage of ImageElement, is_offscreen_by_attribute() is not allowed')

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
                                      self.center_coordinates[0] + offset_x,
                                      self.center_coordinates[1] + offset_y)
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    @property
    def size(self):
        left, top, right, bottom = self.corners_coordinates

        width = right - left
        height = bottom - top

        return {
            'width': width,
            'height': height
        }

    @property
    def location(self):
        left, top, _, _ = self.corners_coordinates

        return {
            'x': left,
            'y': top
        }

    @property
    def center_coordinates(self):
        left = self.location['x']
        top = self.location['y']
        width = self.size['height']
        height = self.size['height']

        return (
            left + int(width / 2),
            top + int(height / 2)
        )

    @property
    def corners_coordinates(self):
        return self.__corners_coordinates

    @property
    def image_name(self):
        return self.__image_name

    def send_keys(self, special_key):
        raise MstrException('Invalid usage of ImageElement, send_keys() is not allowed')

    def send_keys_with_check(self, text):
        raise MstrException('Invalid usage of ImageElement, send_keys_with_check() is not allowed')
