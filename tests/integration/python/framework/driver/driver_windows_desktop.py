import subprocess

from appium import webdriver
from selenium.common.exceptions import WebDriverException

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

    WIN_APP_DRIVER = 'WinAppDriver.exe'
    WIN_APP_DRIVER_START = r'start "" "C:\Program Files (x86)\Windows Application Driver\%s" ' \
                           r'127.0.0.1 4723/wd/hub' % WIN_APP_DRIVER
    WIN_APP_DRIVER_STOP = r'taskkill /f /t /im %s' % WIN_APP_DRIVER

    DRIVER_INITIALIZATION_ATTEMPT_COUNT = 5

    win_app_driver_process = None

    def get_driver(self):
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
            driver = self._initialize_driver(host, capabilities)

            if driver:
                return driver

        raise MstrException(
            'Error while starting tests for Windows Desktop. '
            'Ensure WinAppDriver is running and configuration is correct (e.g. path to EXCEL.EXE).'
        )

    def _initialize_driver(self, host, capabilities):
        try:
            driver = webdriver.Remote(command_executor=host, desired_capabilities=capabilities)
            driver.implicitly_wait(DEFAULT_TIMEOUT)

            Util.pause(4)

            return driver

        except WebDriverException as e:
            Util.log_error(
                'Error while starting tests for Windows Desktop. '
                'Ensure WinAppDriver is running and configuration is correct (e.g. path to EXCEL.EXE): %s' % e
            )

        return None

    @staticmethod
    def before_driver_startup():
        DriverWindowsDesktop._stop_win_app_driver()

        DriverWindowsDesktop._start_win_app_driver()

    @staticmethod
    def driver_cleanup(driver):
        DriverWindowsDesktop._stop_win_app_driver()

    @staticmethod
    def _start_win_app_driver():
        if not DriverWindowsDesktop.win_app_driver_process and ConfigUtil.is_run_win_app_driver_enabled():
            DriverWindowsDesktop.win_app_driver_process = subprocess.Popen(
                DriverWindowsDesktop.WIN_APP_DRIVER_START,
                shell=True
            )

    @staticmethod
    def _stop_win_app_driver():
        if ConfigUtil.is_run_win_app_driver_enabled():
            subprocess.run(DriverWindowsDesktop.WIN_APP_DRIVER_STOP)

            DriverWindowsDesktop.win_app_driver_process = None
