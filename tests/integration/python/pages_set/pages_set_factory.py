from framework.driver.driver_type import DRIVER_TYPE_MAC_CHROME, DRIVER_TYPE_MAC_DESKTOP, DRIVER_TYPE_WINDOWS_DESKTOP, \
    DRIVER_TYPE_WINDOWS_CHROME
from framework.util.config_util import ConfigUtil
from pages_set.pages_set_mac_chrome import PagesSetMacChrome
from pages_set.pages_set_mac_desktop import PagesSetMacDesktop
from pages_set.pages_set_windows_chrome import PagesSetWindowsChrome
from pages_set.pages_set_windows_desktop import PagesSetWindowsDesktop


class PagesSetFactory:
    """
    Pages factory responsible for initialization, providing and resetting pages.
    """
    PAGES_DEF = {
        DRIVER_TYPE_WINDOWS_DESKTOP: PagesSetWindowsDesktop,
        DRIVER_TYPE_WINDOWS_CHROME: PagesSetWindowsChrome,
        DRIVER_TYPE_MAC_DESKTOP: PagesSetMacDesktop,
        DRIVER_TYPE_MAC_CHROME: PagesSetMacChrome
    }

    pages = None

    def get_pages_set(self):
        driver_type = ConfigUtil.get_driver_type()

        if not PagesSetFactory.pages:
            PagesSetFactory.pages = PagesSetFactory.PAGES_DEF[driver_type]()

        return PagesSetFactory.pages

    @classmethod
    def reset_pages_set(cls):
        PagesSetFactory.pages = None
