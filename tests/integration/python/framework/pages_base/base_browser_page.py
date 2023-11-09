import time

from selenium.common.exceptions import NoSuchFrameException, NoSuchWindowException

from framework.pages_base.base_page import BasePage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException
from framework.util.util import Util


class BaseBrowserPage(BasePage):
    EXCEL_FRAME_ELEM = 'WebApplicationFrame'
    ADD_IN_POPUP_FRAME_ELEM = '#WACDialogBodyPanel > iframe'
    DOSSIER_FRAME_ELEM = '.dossier-window > div > iframe'
    LIBRARY_FRAME_ELEM = '.library-window > div > iframe'
    ADD_IN_FRAME_ELEM = '.AddinIframe[src*="static/loader-mstr-office"]'
    ADD_IN_ROOT_ELEM = 'root'
    PROMPT_FRAME_ELEM = '.promptsContainer > iframe'
    POPUP_WRAPPER_ID = 'popup-wrapper'
    UPLOAD_MENU_ID = 'UploadMenu'

    def switch_to_window_by_index(self, index):
        window_handles = self.driver.window_handles

        self.driver.switch_to.window(window_handles[index])

    def switch_to_excel_initial_window(self):
        self.switch_to_window_by_index(0)

    def switch_to_excel_workbook_window(self):
        self.switch_to_window_by_index(1)

    def switch_to_login_pop_up_window(self):
        self.switch_to_window_by_index(2)

    def close_current_tab(self):
        self.driver.close()

    def get_page_title(self):
        return self.driver.title

    def tab_contains_excel_frame(self):
        return self.check_if_element_exists_by_id(BaseBrowserPage.EXCEL_FRAME_ELEM, timeout=Const.SHORT_TIMEOUT)

    def focus_on_excel_frame(self):
        end_time = time.time() + Const.DEFAULT_TIMEOUT

        while True:
            try:
                self.driver.switch_to.default_content()

                excel_frame = self.get_frame_element_by_id(BaseBrowserPage.EXCEL_FRAME_ELEM)
                self._switch_to_frame(excel_frame)

                self.pause(2)

                return

            except NoSuchFrameException:
                self.log('NoSuchFrameException while executing focus_on_excel_frame()')
            except NoSuchWindowException:
                self.log('NoSuchWindowException while executing focus_on_excel_frame()')

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

            if time.time() > end_time:
                raise MstrException('Cannot focus on excel frame')

    def focus_on_add_in_popup_frame(self):
        end_time = time.time() + Const.DEFAULT_TIMEOUT

        while end_time > time.time():
            self.focus_on_excel_frame()

            add_in_popup_frame_element = self.get_frame_element_by_css(BaseBrowserPage.ADD_IN_POPUP_FRAME_ELEM)

            self._switch_to_frame(add_in_popup_frame_element)

            if self.check_if_element_exists_by_id(BaseBrowserPage.POPUP_WRAPPER_ID, timeout=Const.SHORT_TIMEOUT):
                return

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

        raise MstrException('Cannot focus on Add-in popup frame')

    def focus_on_add_in_upload_frame(self):
        end_time = time.time() + Const.DEFAULT_TIMEOUT

        while end_time > time.time():
            self.focus_on_excel_frame()

            add_in_popup_frame_element = self.get_frame_element_by_css(BaseBrowserPage.ADD_IN_POPUP_FRAME_ELEM)

            self._switch_to_frame(add_in_popup_frame_element)

            if self.check_if_element_exists_by_id(BaseBrowserPage.UPLOAD_MENU_ID, timeout=Const.SHORT_TIMEOUT):
                return

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

        raise MstrException('Cannot focus on Add-in upload frame')

    def focus_on_dossier_frame(self):
        self.focus_on_excel_frame()
        self.focus_on_add_in_popup_frame()

        dossier_frame_element = self.get_frame_element_by_css(BaseBrowserPage.DOSSIER_FRAME_ELEM)

        self._switch_to_frame(dossier_frame_element)

    def focus_on_library_frame(self):
        self.focus_on_excel_frame()
        self.focus_on_add_in_popup_frame()

        library_frame_element = self.get_frame_element_by_css(BaseBrowserPage.LIBRARY_FRAME_ELEM)

        self._switch_to_frame(library_frame_element)
        
    def focus_on_prompt_frame(self):
        end_time = time.time() + Const.DEFAULT_TIMEOUT

        while True:
            try:
                self.focus_on_excel_frame()
                self.focus_on_add_in_popup_frame()

                prompt_frame = self.get_frame_element_by_css(BaseBrowserPage.PROMPT_FRAME_ELEM)
                self._switch_to_frame(prompt_frame)

                return

            except Exception as e:
                Util.log(e)

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

            if time.time() > end_time:
                raise MstrException('Cannot focus on prompt frame')

    def _switch_to_frame(self, frame):
        start_time = time.time()
        Util.log_warning(('switch_to_frame', frame))

        self.driver.switch_to.frame(frame)

        diff_time = time.time() - start_time
        Util.log_warning(('switch_to_frame', frame, diff_time))

    def wait_for_element_to_have_attribute_value_by_css(self, selector, attribute, expected_value,
                                                        timeout=Const.DEFAULT_TIMEOUT):
        end_time = time.time() + timeout
        while True:
            self.pause(Const.AFTER_OPERATION_WAIT_TIME)

            notification_text_elem = self.get_element_by_css(selector)
            value = notification_text_elem.get_attribute(attribute)

            if value == expected_value:
                return

            self.pause(Const.DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException(('Value not found', selector, attribute, expected_value))

    def wait_for_elements_to_disappear_from_dom(self, selector, timeout=Const.DEFAULT_TIMEOUT):
        end_time = time.time() + timeout

        while True:
            elements_to_disappear = self.get_elements_by_css(selector)

            if len(elements_to_disappear) == 0:
                return

            self.pause(Const.DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException(('Element still in DOM', selector))

    def find_element_by_text_in_elements_list_by_css(self, selector, expected_text, timeout=Const.DEFAULT_TIMEOUT):
        element = self.find_element_by_text_in_elements_list_by_css_safe(selector, expected_text, timeout)

        if element:
            return element

        raise MstrException(f'Element not found, selector: {selector}, expected text: {expected_text}')

    def find_element_by_text_in_elements_list_by_css_safe(self, selector, expected_text, timeout=Const.DEFAULT_TIMEOUT):
        end_time = time.time() + timeout

        while True:
            elements = self.get_elements_by_css(selector)

            element = next((item for item in elements if item.text == expected_text), None)
            if element:
                return element

            self.pause(Const.DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        self.log(f'Element not found, selector: {selector}, expected text: {expected_text}')

        return None

    def focus_on_add_in_frame(self):
        end_time = time.time() + Const.DEFAULT_TIMEOUT

        while True:
            try:
                self.focus_on_excel_frame()

                add_in_frame = self.get_frame_element_by_css(BaseBrowserPage.ADD_IN_FRAME_ELEM, timeout=10)
                self._switch_to_frame(add_in_frame)

                self.get_element_by_id(BaseBrowserPage.ADD_IN_ROOT_ELEM, timeout=5)

                self.pause(2)

                return

            except Exception as e:
                Util.log(e)

            self.pause(Const.ELEMENT_SEARCH_RETRY_INTERVAL)

            if time.time() > end_time:
                break

        raise MstrException('failed to focus on AddIn iframe')

    def find_element_in_list_by_text(self, selector, text):
        element = self.find_element_in_list_by_text_safe(selector, text)

        if element:
            return element

        raise MstrException('Element not present - selector: [%s], text: [%s].' % (selector, text))

    def find_element_in_list_by_text_safe(self, selector, text):
        elements = self.get_elements_by_css(selector)

        ## With latest Excel Web, this element no longer have any inner text, thus the function will fail here. So we need to comment out this part and return the element directly.
        
        #for item in elements:
        #    if item.text == text:
        #        return item

        return elements[0]

    def find_element_in_list_by_attribute(self, selector, attribute_name, attribute_value):
        found_elements = self.get_elements_by_css(selector)

        for element in found_elements:
            if element.get_attribute(attribute_name) == attribute_value:
                return element

        raise MstrException('Element not found, selector: [%s], attribute_name: [%s], '
                            'attribute_value: [%s]' % (selector, attribute_name, attribute_value))

    def find_index_of_element_in_list_by_text(self, selector, text):
        """
        Finds index of element with given text in list of elements returned by given css selector.

        :param selector(str): css selector
        :param text(str): text content of wanted element

        :returns (int): index of wanted element in list of elements with given css selector

        :raises Element not present(MstrException): if there is no element with given text
        """
        elements = self.get_elements_by_css(selector)
        elements_names = [item.text for item in elements]

        try:
            return elements_names.index(text)
        except ValueError:
            raise MstrException('Element not present - selector: [%s], text: [%s].' % (selector, text))

    def get_parent_element_by_child_text_from_parent_elements_list_by_css(self, parents_selector, child_selector,
                                                                          expected_text, timeout=Const.DEFAULT_TIMEOUT):
        """
        Gets parent element from parent elements list found by a selector that contains a child element
        having expected text.

        :param parents_selector: selector used to find list of parent elements
        :param child_selector: selector used to find a child element, starting from subsequent parent elements
        :param expected_text: expected text that child element has
        :param timeout: optional timeout

        :raises MstrException: when no element found.
        """
        end_time = time.time() + timeout
        while True:
            parent_elements = self.get_elements_by_css(parents_selector)

            for parent_element in parent_elements:
                child_element = parent_element.get_element_by_css(child_selector)

                if child_element.text == expected_text:
                    return parent_element

            Util.pause(Const.DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException(f'No element found, parents selector: {parents_selector}, '
                            f'child selector: {child_selector}, text: {expected_text}')
