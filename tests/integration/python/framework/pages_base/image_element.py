from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By

from framework.pages_base.base_element import BaseElement
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException
from framework.util.image_util import ImageUtil
from framework.util.util import Util


class ImageElement(BaseElement):
    EXCEL_ROOT_ELEMENT = 'Excel'

    excel_element = None

    def __init__(self, image_data, driver):
        super().__init__(None, driver)
        self.__image_data = image_data
        self.__driver = driver

        self.image_util = ImageUtil()

    @classmethod
    def reset_excel_root_element(cls, driver, root_element=EXCEL_ROOT_ELEMENT):
        ImageElement.excel_element = BaseElement(driver.find_element(By.NAME, root_element), driver)

    def click(self, offset_x=0, offset_y=0, wait_after_click=Const.AFTER_OPERATION_WAIT_TIME):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__image_data.center_coordinates['x'] + offset_x,
                                      self.__image_data.center_coordinates['y'] + offset_y)
         .click()
         .perform())

        Util.pause(wait_after_click)

    def double_click(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__image_data.center_coordinates['x'] + offset_x,
                                      self.__image_data.center_coordinates['y'] + offset_y)
         .double_click()
         .perform())

        Util.pause(Const.AFTER_OPERATION_WAIT_TIME)

    def right_click(self, offset_x=0, offset_y=0):
        (ActionChains(self.__driver)
         .move_to_element_with_offset(ImageElement.excel_element,
                                      self.__image_data.center_coordinates['x'] + offset_x,
                                      self.__image_data.center_coordinates['y'] + offset_y)
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

    def get_text_content_by_attribute(self):
        raise MstrException('Invalid usage of ImageElement, get_text_content_by_attribute() is not allowed')

    def get_class_name_by_attribute(self):
        raise MstrException('Invalid usage of ImageElement, get_class_name_by_attribute() is not allowed')

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
                                      self.__image_data.center_coordinates['x'] + offset_x,
                                      self.__image_data.center_coordinates['y'] + offset_y)
         .perform())

        Util.pause(Const.AFTER_OPERATION_WAIT_TIME)

    @property
    def size(self):
        return self.__image_data.size

    @property
    def location(self):
        return {
            'x': self.__image_data.coordinates['left'],
            'y': self.__image_data.coordinates['top']
        }

    @property
    def corners_coordinates(self):
        return self.__image_data.coordinates

    @property
    def image_name(self):
        return self.__image_data.image_name

    def send_keys(self, special_key):
        raise MstrException('Invalid usage of ImageElement, send_keys() is not allowed')

    def send_keys_with_check(self, text):
        raise MstrException('Invalid usage of ImageElement, send_keys_with_check() is not allowed')

    def pick_color(self, offset_x=0, offset_y=0, force_new_screenshot=False):
        """
        Picks color from coordinates relative to element left top corner (0, 0).

        It uses image stored in this ImageElement.

        :param offset_x: X coordinate to pick color from.
        :param offset_y: Y coordinate to pick color from.
        :param force_new_screenshot: not used in Image Element.

        :return: Color as a hex string, e.g. '#ffaac1'.
        """
        return self.image_util.get_color_from_image(self.__image_data.image, offset_x, offset_y)
