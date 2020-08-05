from appium import webdriver
from urllib3.exceptions import MaxRetryError

from framework.driver.abstract_driver import AbstractDriver
from framework.util.config_util import ConfigUtil
from framework.util.exception.MstrException import MstrException


class DriverMacDesktop(AbstractDriver):
    MICROSOFT_EXCEL_APP_NAME = 'Microsoft Excel'

    def get_driver(self):
        host = ConfigUtil.get_desktop_host()

        capabilities = {
            'platformName': 'Mac',
            'deviceName': 'Mac',
            'app': 'Root',
        }

        try:
            driver = webdriver.Remote(host, capabilities)

            driver.get(DriverMacDesktop.MICROSOFT_EXCEL_APP_NAME)

            return driver

        except MaxRetryError:
            raise MstrException('Error while starting test, ensure AppiumForMac is running')

    @staticmethod
    def driver_cleanup(driver):
        pass
