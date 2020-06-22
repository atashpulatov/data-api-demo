from appium import webdriver
from urllib3.exceptions import MaxRetryError

from util.config_util import ConfigUtil


class DriverMacDesktop:
    def get_driver(self):
        host = ConfigUtil.get_desktop_host()

        capabilities = {
            'platformName': 'Mac',
            'deviceName': 'Mac',
            'app': 'Root',
        }

        try:
            return webdriver.Remote(host, capabilities)
        except MaxRetryError:
            raise Exception('Error while starting test, ensure AppiumForMac is running')

    @staticmethod
    def driver_cleanup(driver):
        pass
