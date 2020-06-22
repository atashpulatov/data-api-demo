from appium import webdriver
from urllib3.exceptions import MaxRetryError

from util.config_util import ConfigUtil
from util.util import Util


class DriverWindowsDesktop:
    DRIVER_INITIALIZATION_ATTEMPT_COUNT = 10

    CONNECT_TO_OPEN_EXCEL = True

    def get_driver(self):
        if ConfigUtil.is_attaching_to_open_excel_enabled():
            return self._prepare_driver_attached_to_open_excel()
        else:
            return self._prepare_driver()

    def _prepare_driver_attached_to_open_excel(self):
        host = ConfigUtil.get_desktop_host()

        capabilities = {
            'app': 'Root',
            'platformName': 'Windows',
            'deviceName': 'WindowsPC',
            'ms:experimental-webdriver': True,
            'newCommandTimeout': 360,
        }

        tmp_driver = webdriver.Remote(command_executor=host, desired_capabilities=capabilities)
        tmp_driver.implicitly_wait(60)

        excel_element = tmp_driver.find_element_by_name('Book1 - Excel')
        native_window_handle = hex(int(excel_element.get_attribute('NativeWindowHandle')))

        capabilities = {
            'platformName': 'Windows',
            'deviceName': 'WindowsPC',
            'ms:experimental-webdriver': True,
            'newCommandTimeout': 360,
            'appTopLevelWindow': native_window_handle,
        }

        driver = webdriver.Remote(command_executor=host, desired_capabilities=capabilities)
        driver.implicitly_wait(60)

        return driver

    def _prepare_driver(self):
        host = ConfigUtil.get_desktop_host()

        executable_path = ConfigUtil.get_driver_executable_path()

        capabilities = {
            'app': executable_path,
            'appArguments': '/e',  # disable splash screen
            'platformName': 'Windows',
            'deviceName': 'WindowsPC',
            'ms:experimental-webdriver': True,
            'newCommandTimeout': 360,
        }

        for i in range(1, DriverWindowsDesktop.DRIVER_INITIALIZATION_ATTEMPT_COUNT):
            try:
                driver = webdriver.Remote(command_executor=host, desired_capabilities=capabilities)
                driver.implicitly_wait(60)
                Util.pause(4)

                return driver
            except MaxRetryError:
                raise Exception('Error while starting test, ensure Appium or WinAppDriver is running')

    @staticmethod
    def driver_cleanup(driver):
        pass
