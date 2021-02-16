import subprocess

from appium import webdriver
from urllib3.exceptions import MaxRetryError

from framework.driver.abstract_driver import AbstractDriver
from framework.util.config_util import ConfigUtil
from framework.util.exception.mstr_exception import MstrException
from framework.util.util import Util


class DriverMacDesktop(AbstractDriver):
    MICROSOFT_EXCEL_APP_NAME = 'Microsoft Excel'
    DRIVER_CAPABILITIES = {
        'platformName': 'Mac',
        'deviceName': 'Mac',
        'app': 'Root'
    }

    APPIUM_FOR_MAC = 'AppiumForMac'
    APPIUM_FOR_MAC_START = 'open -g -F -a %s' % APPIUM_FOR_MAC
    APPIUM_FOR_MAC_STOP = ['killall', APPIUM_FOR_MAC]

    appium_for_mac_process = None

    def get_driver(self):
        host = ConfigUtil.get_desktop_host()

        try:
            driver = webdriver.Remote(host, DriverMacDesktop.DRIVER_CAPABILITIES)

            driver.get(DriverMacDesktop.MICROSOFT_EXCEL_APP_NAME)

            return driver

        except MaxRetryError:
            raise MstrException('Error while starting test, ensure AppiumForMac is running or change driver_type.')

    @staticmethod
    def before_driver_startup():
        DriverMacDesktop._stop_appium_for_mac()

        DriverMacDesktop._start_appium_for_mac()

    @staticmethod
    def driver_cleanup(driver):
        DriverMacDesktop._stop_appium_for_mac()

    @staticmethod
    def _start_appium_for_mac():
        if not DriverMacDesktop.appium_for_mac_process and ConfigUtil.is_run_appium_for_mac_enabled():
            DriverMacDesktop.appium_for_mac_process = subprocess.Popen(
                DriverMacDesktop.APPIUM_FOR_MAC_START,
                shell=True
            )
            Util.pause(2)

    @staticmethod
    def _stop_appium_for_mac():
        if ConfigUtil.is_run_appium_for_mac_enabled():
            subprocess.run(DriverMacDesktop.APPIUM_FOR_MAC_STOP)

            DriverMacDesktop.appium_for_mac_process = None
