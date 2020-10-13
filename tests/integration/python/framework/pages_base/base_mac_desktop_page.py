from framework.pages_base.base_page import BasePage
from framework.util.exception.MstrException import MstrException


class BaseMacDesktopPage(BasePage):
    EXCEL_APP_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']"

    EXCEL_MENU_ELEM = EXCEL_APP_ELEM + "/AXMenuBar[0]"

    EXCEL_WINDOW_ELEM = EXCEL_APP_ELEM + "/AXWindow[@AXSubrole='AXStandardWindow']"

    EXCEL_WINDOW_TOP_PART_ELEM = EXCEL_WINDOW_ELEM + "/AXTabGroup[0]"

    POPUP_WRAPPER_ELEM = EXCEL_WINDOW_ELEM + "/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]"

    RIGHT_SIDE_PANEL_ELEM = EXCEL_WINDOW_ELEM + "/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/" \
                                                "AXGroup[0]/AXScrollArea[0]/AXWebArea[0]"

    RIGHT_SIDE_PANEL_DIALOG_ELEM = RIGHT_SIDE_PANEL_ELEM + "/AXGroup[@AXSubrole='AXApplicationDialog']"

    SEARCH_ELEMENT_INTERVAL = 0.1

    MAX_SOURCE_LIST_NO = 50

    def get_elements_by_xpath(self, selector, expected_list_len=None, max_source_list_no=MAX_SOURCE_LIST_NO):
        elements_with_indices = self.get_elements_by_xpath_with_indices(selector, expected_list_len, max_source_list_no)

        elements = [item.element for item in elements_with_indices]

        return elements

    def get_elements_by_xpath_with_indices(self,
                                           selector,
                                           expected_list_len=None,
                                           max_source_list_no=MAX_SOURCE_LIST_NO):
        """
        Getting list of elements implementation specific for AppiumForMac, which allows only for finding
        single elements.

        Examples of selectors:
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[%s]/AXGroup[0]'
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[0]/AXGroup[%s]'

        How it works:

        I. When expected_list_len is None (assumption: list ends when element not found for the smallest i):

        1. Check if element with index 0 exists (substitute '%s' (or '%d') in a given selector).
        2. If it exists, get it and add to list, increase index by 1 and go to 1.
        3. If it doesn't exist for current i, finish and return list of found elements.

        Example:

        For selector '/SOME_PATH/AXList/AXGroup[0]/AXGroup[%s]/AXGroup[0]' and document structure:

        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[0]/AXGroup[0]'
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[1]/AXStaticText[0]'
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[2]/AXGroup[0]'

        returns only 1 element:

        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[0]/AXGroup[0]'

        II. When expected_list_len is not None (assumption: list can have expected_list_len elements, ignore not found
        elements for smaller indices):

        1. Check if element with index 0 exists (substitute '%s' (or '%d') in a given selector).
        2. If it exists, get it and add to list, increase index by 1 and go to 1.
        3. Continue as long as expected_list_len >= i.

        Example:

        For selector '/SOME_PATH/AXList/AXGroup[0]/AXGroup[%s]/AXGroup[0]', expected_list_len=2 and document structure:

        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[0]/AXGroup[0]'
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[1]/AXStaticText[0]'
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[2]/AXGroup[0]'

        returns 2 elements:

        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[0]/AXGroup[0]'
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[2]/AXGroup[0]'

        :param selector: Selector to search for elements.
        :param expected_list_len: Expected length of returned elements list (maximum number of elements to be found)
               or None to stop searching on first not found element.
        :param max_source_list_no: Maximum number of elements to be checked, when no expected_list_len elements found.
        :return: List of found elements, empty list when no element found.
        """
        found_elements = []

        i = 0
        while True:
            selector_xpath = selector % i

            element_exists = self.check_if_element_exists_by_xpath(
                selector_xpath,
                timeout=BaseMacDesktopPage.SEARCH_ELEMENT_INTERVAL
            )

            self.log(('get_elements_by_xpath', element_exists, selector_xpath))

            if element_exists:
                element = self.get_element_by_xpath(selector_xpath)

                found_elements.append(ElementWithIndex(element, i))
            else:
                if expected_list_len is None:
                    break

            i += 1

            if expected_list_len is not None and len(found_elements) == expected_list_len:
                break

            if i == max_source_list_no:
                return found_elements

        return found_elements

    def get_element_by_xpath_workaround(self, selector, max_source_list_no=MAX_SOURCE_LIST_NO):
        """
        Gets first element by xpath using get_elements_by_xpath().

        :param selector: Selector to search for elements.
        :param max_source_list_no: Maximum number of elements to be checked, when no expected_list_len elements found.
        :return: First found element or raises MstrException when no element found.
        """
        elements = self.get_elements_by_xpath(selector, expected_list_len=1, max_source_list_no=max_source_list_no)

        if elements:
            return elements[0]

        raise MstrException('No element found by selector: [%s]' % selector)

    def get_element_by_xpath_workaround_with_index(self, selector, max_source_list_no=MAX_SOURCE_LIST_NO):
        """
        Gets first element by xpath using get_elements_by_xpath().

        :param selector: Selector to search for elements.
        :param max_source_list_no: Maximum number of elements to be checked, when no expected_list_len elements found.
        :return: First found element or raises MstrException when no element found.
        """
        elements = self.get_elements_by_xpath_with_indices(selector, expected_list_len=1,
                                                           max_source_list_no=max_source_list_no)

        if elements:
            return elements[0]

        raise MstrException('No element found by selector: [%s]' % selector)

    def find_element_by_attribute_in_elements_list_by_xpath(self, selector, attribute_name, attribute_value):
        found_elements = self.get_elements_by_xpath(selector)

        for element in found_elements:
            if element.get_attribute(attribute_name) == attribute_value:
                return element

        raise MstrException('Element not found, selector: [%s], attribute_name: [%s], '
                            'attribute_value: [%s]' % (selector, attribute_name, attribute_value))


class ElementWithIndex:
    """
    Element wrapper used when getting elements with index.
    """

    element = None
    index = None

    def __init__(self, element, index):
        self.element = element
        self.index = index
