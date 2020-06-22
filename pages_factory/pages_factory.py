from driver.driver_type import DRIVER_TYPE_MAC_CHROME, DRIVER_TYPE_MAC_DESKTOP, DRIVER_TYPE_WINDOWS_DESKTOP, \
    DRIVER_TYPE_WINDOWS_CHROME
from pages_factory.pages_browser import PagesBrowser
from pages_factory.pages_mac_desktop import PagesMacDesktop
from pages_factory.pages_windows_desktop import PagesWindowsDesktop
from util.config_util import ConfigUtil


class PagesFactory:
    """
    Pages factory responsible for initialization, providing and resetting pages.
    """
    PAGES_DEF = {
        DRIVER_TYPE_WINDOWS_DESKTOP: PagesWindowsDesktop,
        DRIVER_TYPE_WINDOWS_CHROME: PagesBrowser,
        DRIVER_TYPE_MAC_DESKTOP: PagesMacDesktop,
        DRIVER_TYPE_MAC_CHROME: PagesBrowser,
    }

    DRIVERS_REQUIRING_RESET = [DRIVER_TYPE_WINDOWS_DESKTOP]

    pages = None

    def get_pages(self):
        driver_type = ConfigUtil.get_driver_type()

        if not PagesFactory.pages:
            PagesFactory.pages = PagesFactory.PAGES_DEF[driver_type]()

        return PagesFactory.pages

    @classmethod
    def reset_pages(cls):
        driver_type = ConfigUtil.get_driver_type()
        if driver_type in PagesFactory.DRIVERS_REQUIRING_RESET:
            PagesFactory.pages = None
