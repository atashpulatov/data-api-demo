from appium import webdriver
from urllib3.exceptions import MaxRetryError

from util.config_util import ConfigUtil
from util.exception.MstrException import MstrException
from util.util import Util


class DriverWindowsDesktop:
    DRIVER_INITIALIZATION_ATTEMPT_COUNT = 10

    def get_driver(self):
        if ConfigUtil.is_attaching_to_existing_session_enabled():
            return self._prepare_driver_existing_session()
        else:
            return self._prepare_driver_new_session()

    def _prepare_driver_existing_session(self):
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

        excel_root_element_name = ConfigUtil.get_windows_desktop_excel_root_element_name()
        excel_element = tmp_driver.find_element_by_name(excel_root_element_name)
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

    def _prepare_driver_new_session(self):
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
                raise MstrException('Error while starting test, ensure Appium or WinAppDriver is running')

    @staticmethod
    def driver_cleanup(driver):
        pass
