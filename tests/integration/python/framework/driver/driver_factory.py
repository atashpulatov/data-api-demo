from framework.driver.driver_mac_chrome import DriverMacChrome
from framework.driver.driver_mac_desktop import DriverMacDesktop
from framework.driver.driver_type import DRIVER_TYPE_MAC_CHROME, DRIVER_TYPE_MAC_DESKTOP, DRIVER_TYPE_WINDOWS_DESKTOP, \
    DRIVER_TYPE_WINDOWS_CHROME
from framework.driver.driver_windows_chrome import DriverWindowsChrome
from framework.driver.driver_windows_desktop import DriverWindowsDesktop


class DriverFactory:
    """
    Driver factory responsible for initialization, providing, resetting and cleanup of selected driver.
    """
    DRIVER_CLASS_DEF = {
        DRIVER_TYPE_WINDOWS_DESKTOP: DriverWindowsDesktop,
        DRIVER_TYPE_WINDOWS_CHROME: DriverWindowsChrome,
        DRIVER_TYPE_MAC_DESKTOP: DriverMacDesktop,
        DRIVER_TYPE_MAC_CHROME: DriverMacChrome,
    }

    DRIVER_DEF = {}
    DRIVER_STARTUP_DEF = {}
    BEFORE_DRIVER_CLEANUP_DEF = {}

    def __init__(self):
        for driver_type in DriverFactory.DRIVER_CLASS_DEF:
            driver_class = DriverFactory.DRIVER_CLASS_DEF[driver_type]

            DriverFactory.DRIVER_DEF[driver_type] = driver_class().get_driver
            DriverFactory.DRIVER_STARTUP_DEF[driver_type] = driver_class.before_driver_startup
            DriverFactory.BEFORE_DRIVER_CLEANUP_DEF[driver_type] = driver_class.driver_cleanup

    driver = None
    driver_type = None

    def get_driver(self, driver_type):
        if not DriverFactory.driver:
            DriverFactory.driver_type = driver_type
            DriverFactory.driver = DriverFactory.DRIVER_DEF[driver_type]()

        return DriverFactory.driver

    def get_before_driver_startup(self, driver_type):
        return DriverFactory.DRIVER_STARTUP_DEF[driver_type]

    def get_driver_cleanup(self, driver_type):
        return DriverFactory.BEFORE_DRIVER_CLEANUP_DEF[driver_type]

    @classmethod
    def reset_driver(cls):
        DriverFactory.driver = None
