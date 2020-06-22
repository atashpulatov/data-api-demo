from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from driver.driver_factory import DriverFactory
from pages.page_util.element_check import ElementCheck
from pages.page_util.element_click import ElementClick
from pages.page_util.element_get import ElementGet
from util.config_util import ConfigUtil
from util.const import AFTER_OPERATION_WAIT_TIME
from util.util import Util


class BasePage(ElementClick, ElementGet, ElementCheck):
    NAME_ATTRIBUTE = 'Name'

    def __init__(self):
        super().__init__()
        driver_type = ConfigUtil.get_driver_type()

        self.driver = DriverFactory().get_driver(driver_type)

    def log(self, obj):
        Util.log(obj)

    def log_warning(self, obj):
        Util.log_warning(obj)

    def log_error(self, obj):
        Util.log_error(obj)

    def pause(self, secs):
        Util.pause(secs)

    def get_actions(self):
        """
        Returns ActionChains for executing chained low level actions.

        A new object is created each time - using shared object causes issues when moving to elements on Mac desktop
        Excel when executing subsequent tests (first unnecessarily moves to top-left corner of the screen, then to
        required element, which disables clicking in the next step). It's also possible to use low level API
        directly (driver.execute()) without chaining calls.
        """
        return ActionChains(self.driver)

    def wait_for_element_visibility_by_css(self, selector, timeout=20):
        self._wait_for_element_visibility(By.CSS_SELECTOR, selector, timeout)

    def _wait_for_element_visibility(self, selector_type, selector, timeout):
        wait = WebDriverWait(self.driver, timeout)

        wait.until(ec.visibility_of_element_located((selector_type, selector)))

    def click_element_simple(self, element):
        try:
            element.click()
        except ElementClickInterceptedException as e:
            self.log_error(e)
            self.pause(120)

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def click_element_with_offset(self, element, xoffset=0, yoffset=0):
        (self.get_actions()
         .move_to_element_with_offset(element, xoffset, yoffset)
         .pause(AFTER_OPERATION_WAIT_TIME)
         .click()
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def click_element_right_button(self, element):
        (self.get_actions()
         .move_to_element(element)
         .context_click()
         .perform())

    def move_to_element(self, element, xoffset=0, yoffset=0):
        (self.get_actions()
         .move_to_element_with_offset(element, xoffset, yoffset)
         .pause(2)
         .perform())

        Util.pause(AFTER_OPERATION_WAIT_TIME)

    def prepare_image_name(self, image_name):
        return '%s_%s' % (self.__class__.__name__, image_name)

    def get_element_name(self, element):
        return element.get_attribute(BasePage.NAME_ATTRIBUTE)
