from pages_base.base_page import BasePage
from util.exception.MstrException import MstrException


class BaseMacDesktopPage(BasePage):
    EXCEL_APP_ELEM = "/AXApplication[@AXTitle='Microsoft Excel']"

    EXCEL_MENU_ELEM = "%s/AXMenuBar[0]" % EXCEL_APP_ELEM

    EXCEL_WINDOW_ELEM = "%s/AXWindow[@AXSubrole='AXStandardWindow']" % EXCEL_APP_ELEM

    EXCEL_WINDOW_TOP_PART_ELEM = "%s/AXTabGroup[0]" % EXCEL_WINDOW_ELEM

    DISPLAY_ATTRIBUTE_FORM_ELEM = "%s/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/" \
                                  "AXGroup[2]" % EXCEL_WINDOW_ELEM

    POPUP_WRAPPER_ELEM = "%s/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/" \
                         "AXGroup[@AXDOMIdentifier='popup-wrapper']" % EXCEL_WINDOW_ELEM

    RIGHT_SIDE_PANEL_ELEM = "%s/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/" \
                            "AXScrollArea[0]/AXWebArea[0]" % EXCEL_WINDOW_ELEM

    RIGHT_SIDE_PANEL_OVERLAY_ELEM = "%s/AXGroup[@AXDOMIdentifier='overlay']" % RIGHT_SIDE_PANEL_ELEM

    RIGHT_SIDE_PANEL_DIALOG_ELEM = "%s/AXGroup[@AXSubrole='AXApplicationDialog']" % RIGHT_SIDE_PANEL_ELEM

    SEARCH_ELEMENT_INTERVAL = 0.1

    def get_elements_by_xpath(self, selector):
        """
        Getting list of elements implementation specific for AppiumForMac, which allows only for finding
        single elements.

        Examples of selectors:
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[%s]/AXGroup[0]'
        '/SOME_PATH/AXList/AXGroup[0]/AXGroup[0]/AXGroup[%s]'

        How it works:
        1. Check if element with index 0 exists (substitute '%s' (or '%d') in a given selector).
        2. If it exists, get it and add to list, increase index by 1 and go to 1.
        3. If it doesn't exist, finish and return list of found elements.

        :param selector: Selector to search for elements.
        :return: List of found elements, empty list when no element found.
        """
        found_elements = []

        i = 0
        while True:
            selector_xpath = selector % i
            self.log_error(selector_xpath)

            element_exists = self.check_if_element_exists_by_xpath(
                selector_xpath,
                timeout=BaseMacDesktopPage.SEARCH_ELEMENT_INTERVAL
            )

            if element_exists:
                element = self.get_element_by_xpath(selector_xpath)

                found_elements.append(element)
            else:
                break

            i += 1

        return found_elements

    def find_element_by_attribute_in_elements_list_by_xpath(self, selector, attribute_name, attribute_value):
        found_elements = self.get_elements_by_xpath(selector)

        for element in found_elements:
            if element.get_attribute(attribute_name) == attribute_value:
                return element

        raise MstrException('Element not found, selector: [%s], attribute_name: [%s], '
                            'attribute_value: [%s]' % (selector, attribute_name, attribute_value))
