from framework.pages_base.base_page import BasePage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException


class WindowsDesktopMainAddInElementCache(BasePage):
    """
    Main Add-in elements cache (Main Pop Up window and Right Side Panel), used for improving searching elements
    performance.

    To improve XPath search performance, those elements are used as parents for relative searches.

    Example:

    add_in_main_element = self.get_add_in_main_element()
    element = add_in_main_element.get_element_by_xpath(xpath_selector)

    or:

    right_panel_element = self.get_add_in_right_panel_element()
    element = right_panel_element.get_element_by_xpath(xpath_selector)

    self.get_add_in_main_element() and self.get_add_in_right_panel_element() work because all Windows Desktop pages
    extend BaseWindowsDesktopPage, which extends this class.

    Main Add-In cache must be invalidated (to avoid stale element exception) each time a new Main Add-in window
    is being open (e.g. by clicking Import Data and Add Data buttons, Edit icon, selecting Edit from context menu),
    by calling:

    WindowsDesktopMainAddInElementCache.invalidate_cache()

    Right Side Panel cache must be invalidated before each feature execution, it's done in environment.py,
    in before_feature():

    WindowsDesktopMainAddInElementCache.invalidate_right_panel_cache()
    """
    ADD_IN_MAIN_ELEMENT = 'MicroStrategy for Office'

    __add_in_main_element = None
    __add_in_right_panel_element = None

    @staticmethod
    def invalidate_cache():
        """
        Invalidates Main Add-in element cache.
        """
        WindowsDesktopMainAddInElementCache.__add_in_main_element = None

    @staticmethod
    def invalidate_right_panel_cache():
        """
        Invalidates Right Side Panel element cache.
        """
        WindowsDesktopMainAddInElementCache.__add_in_right_panel_element = None

    def get_add_in_main_element(self):
        """
        Gets Main Add-in element (Main Popup window) using cache.

        :return: Main Add-in element.
        """
        if not WindowsDesktopMainAddInElementCache.__add_in_main_element:
            WindowsDesktopMainAddInElementCache.__add_in_main_element = self._get_main_add_in_element()

        return WindowsDesktopMainAddInElementCache.__add_in_main_element

    def get_add_in_right_panel_element(self):
        """
        Gets Right Side Panel element using cache.

        :return: Right Side Panel element
        """
        if not WindowsDesktopMainAddInElementCache.__add_in_right_panel_element:
            WindowsDesktopMainAddInElementCache.__add_in_right_panel_element = self._get_right_panel_add_in_element()

        return WindowsDesktopMainAddInElementCache.__add_in_right_panel_element

    def _get_main_add_in_element(self):
        all_add_in_elements = self._get_all_add_in_elements()
        all_add_in_elements_no = len(all_add_in_elements)

        if all_add_in_elements_no >= 2:
            return all_add_in_elements[0]

        raise MstrException(f'Main panel Add-in element not found, expected 2 or more '
                            f'[{WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT}] elements, '
                            f'found {all_add_in_elements_no}.')

    def _get_right_panel_add_in_element(self):
        all_add_in_elements = self._get_all_add_in_elements()
        all_add_in_elements_no = len(all_add_in_elements)

        if all_add_in_elements_no == 1:
            return all_add_in_elements[0]
        elif all_add_in_elements_no == 2 or all_add_in_elements_no == 3:
            return all_add_in_elements[1]

        raise MstrException(f'Right panel Add-in element not found, expected 1, 2 or 3 '
                            f'[{WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT}] elements, '
                            f'found {all_add_in_elements_no}.')

    def _get_all_add_in_elements(self):
        i = 0
        while i < Const.ELEMENT_SEARCH_RETRY_NUMBER:
            mstr_elements = self.get_elements_by_name(WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT)

            if mstr_elements:
                return mstr_elements

            self.log(f'Element not found: [{WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT}], try no: {i}')
            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

            i += 1

        raise MstrException('Cannot find any elements: %s' % WindowsDesktopMainAddInElementCache.ADD_IN_MAIN_ELEMENT)
