import subprocess

from appium import webdriver
from urllib3.exceptions import MaxRetryError

from framework.driver.abstract_driver import AbstractDriver
from framework.util.config_util import ConfigUtil
from framework.util.const import DEFAULT_TIMEOUT
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class DriverWindowsDesktop(AbstractDriver):
    DRIVER_CAPABILITIES_COMMON = {
        'platformName': 'Windows',
        'deviceName': 'WindowsPC',
        'ms:experimental-webdriver': True,
        'newCommandTimeout': 360
    }

    WIN_APP_DRIVER_START = r'start "" "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe"'

    DRIVER_INITIALIZATION_ATTEMPT_COUNT = 10

    def get_driver(self):
        if ConfigUtil.is_run_win_app_driver_enabled():
            subprocess.Popen(DriverWindowsDesktop.WIN_APP_DRIVER_START, shell=True)

        if ConfigUtil.is_attaching_to_existing_session_enabled():
            return self._prepare_driver_existing_session()
        else:
            return self._prepare_driver_new_session()

    def _prepare_driver_existing_session(self):
        host = ConfigUtil.get_desktop_host()

        native_window_handle = self._find_existing_session_native_window_handle(host)

        capabilities = DriverWindowsDesktop.DRIVER_CAPABILITIES_COMMON.copy()
        capabilities['appTopLevelWindow'] = native_window_handle

        return self._initialize_driver(host, capabilities)

    def _find_existing_session_native_window_handle(self, host):
        capabilities = DriverWindowsDesktop.DRIVER_CAPABILITIES_COMMON.copy()
        capabilities['app'] = 'Root'

        tmp_driver = self._initialize_driver(host, capabilities)

        excel_root_element_name = ConfigUtil.get_windows_desktop_excel_root_element_name()
        excel_element = tmp_driver.find_element_by_name(excel_root_element_name)
        native_window_handle = hex(int(excel_element.get_attribute('NativeWindowHandle')))

        return native_window_handle

    def _prepare_driver_new_session(self):
        host = ConfigUtil.get_desktop_host()

        executable_path = ConfigUtil.get_driver_executable_path()

        capabilities = DriverWindowsDesktop.DRIVER_CAPABILITIES_COMMON.copy()
        capabilities['app'] = executable_path
        capabilities['appArguments'] = '/e'  # disable splash screen

        for i in range(1, DriverWindowsDesktop.DRIVER_INITIALIZATION_ATTEMPT_COUNT):
            try:
                driver = self._initialize_driver(host, capabilities)
                Util.pause(4)

                return driver
            except MaxRetryError:
                raise MstrException('Error while starting test, ensure WinAppDriver is running or change driver_type.')

    def _initialize_driver(self, host, capabilities):
        driver = webdriver.Remote(command_executor=host, desired_capabilities=capabilities)
        driver.implicitly_wait(DEFAULT_TIMEOUT)

        return driver

    @staticmethod
    def driver_cleanup(driver):
        pass
