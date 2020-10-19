from framework.pages_base.base_page import BasePage
from framework.util.const import ELEMENT_SEARCH_RETRY_NUMBER, ELEMENT_SEARCH_RETRY_INTERVAL
from framework.util.exception.MstrException import MstrException


class WindowsDesktopMainAddInElementCache(BasePage):
    """
    Main Add-in element cache, used for improving searching elements performance.

    To improve XPath search performance, Main Add-in element is used as parent for relative searches.

    Example:

    add_in_main_element = self.get_add_in_main_element()
    element = add_in_main_element.get_element_by_xpath(xpath_selector)

    self.get_add_in_main_element() works because pages extend BaseWindowsDesktopPage, which extends this class.

    Cache must be invalidated (to avoid stale element exception) each time a new Main Add-in window is being open
    (e.g. by clicking Import Data and Add Data buttons, Edit icon, selecting Edit from context menu), by calling:

    WindowsDesktopMainAddInElementCache.invalidate_cache()
    """
    ADD_IN_MAIN_ELEMENT = 'MicroStrategy for Office'

    __add_in_main_element = None

    @staticmethod
    def invalidate_cache():
        WindowsDesktopMainAddInElementCache.__add_in_main_element = None

    def get_add_in_main_element(self):
        if not WindowsDesktopMainAddInElementCache.__add_in_main_element:
            WindowsDesktopMainAddInElementCache.__add_in_main_element = self._get_add_in_main_element()

        return WindowsDesktopMainAddInElementCache.__add_in_main_element

    def _get_add_in_main_element(self):
        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER:
            mstr_elements = self.get_elements_by_name(WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT)

            if mstr_elements:
                return mstr_elements[0]

            self.log(f'Element not found: [{WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT}], try no: {i}')
            self.pause(ELEMENT_SEARCH_RETRY_INTERVAL)

            i += 1

        raise MstrException('Cannot find any elements: %s' % WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT)
