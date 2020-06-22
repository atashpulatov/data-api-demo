from selenium import webdriver
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.chrome.options import Options

from util.config_util import ConfigUtil


class DriverWindowsChrome:
    def get_driver(self):
        options = Options().add_argument('lang=en-US')

        capabilities = DesiredCapabilities().CHROME.copy()
        capabilities['pageLoadStrategy'] = 'none'

        driver = webdriver.Chrome(
            executable_path=ConfigUtil.get_driver_executable_path(),
            chrome_options=options,
            desired_capabilities=capabilities
        )

        return driver

    @staticmethod
    def driver_cleanup(driver):
        try:
            driver.quit()
        except:
            pass
