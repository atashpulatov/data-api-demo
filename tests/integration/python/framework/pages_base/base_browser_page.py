import time

from selenium.common.exceptions import NoSuchFrameException, NoSuchWindowException

from framework.pages_base.base_page import BasePage
from framework.util.const import DEFAULT_WAIT_BETWEEN_CHECKS, DEFAULT_TIMEOUT, ELEMENT_SEARCH_RETRY_INTERVAL, \
    SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class BaseBrowserPage(BasePage):
    EXCEL_FRAME_ELEM = 'WebApplicationFrame'
    ADD_IN_POPUP_FRAME_ELEM = '#WACDialogBodyPanel > iframe'
    DOSSIER_FRAME_ELEM = '.dossier-window > div > iframe'
    ADD_IN_FRAME_ELEM = '.AddinIframe'
    ADD_IN_ROOT_ELEM = 'root'
    PROMPT_FRAME_ELEM = '.promptsContainer > iframe'

    def get_element_with_focus(self):
        return self.driver.switch_to.active_element

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
        return self.check_if_element_exists_by_id(BaseBrowserPage.EXCEL_FRAME_ELEM, timeout=SHORT_TIMEOUT)

    def focus_on_excel_frame(self):
        end_time = time.time() + DEFAULT_TIMEOUT

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

            self.pause(ELEMENT_SEARCH_RETRY_INTERVAL)

            if time.time() > end_time:
                raise MstrException('Cannot focus on excel frame')

    def focus_on_add_in_popup_frame(self):
        self.focus_on_excel_frame()

        add_in_popup_frame_element = self.get_frame_element_by_css(BaseBrowserPage.ADD_IN_POPUP_FRAME_ELEM)

        self._switch_to_frame(add_in_popup_frame_element)

    def focus_on_dossier_frame(self):
        self.focus_on_excel_frame()
        self.focus_on_add_in_popup_frame()

        dossier_frame_element = self.get_frame_element_by_css(BaseBrowserPage.DOSSIER_FRAME_ELEM)

        self._switch_to_frame(dossier_frame_element)

    def focus_on_prompt_frame(self):
        end_time = time.time() + DEFAULT_TIMEOUT

        while True:
            try:
                self.focus_on_excel_frame()
                self.focus_on_add_in_popup_frame()

                prompt_frame = self.get_frame_element_by_css(BaseBrowserPage.PROMPT_FRAME_ELEM)
                self._switch_to_frame(prompt_frame)

                return

            except Exception as e:
                Util.log(e)

            self.pause(ELEMENT_SEARCH_RETRY_INTERVAL)

            if time.time() > end_time:
                raise MstrException('Cannot focus on prompt frame')

    def _switch_to_frame(self, frame):
        start_time = time.time()
        Util.log_warning(('switch_to_frame', frame))

        self.driver.switch_to.frame(frame)

        diff_time = time.time() - start_time
        Util.log_warning(('switch_to_frame', frame, diff_time))

    def wait_for_element_to_have_attribute_value_by_css(self, selector, attribute, expected_value,
                                                        timeout=DEFAULT_TIMEOUT):
        end_time = time.time() + timeout
        while True:
            notification_text_elem = self.get_element_by_css(selector)
            value = notification_text_elem.get_attribute(attribute)

            if value == expected_value:
                return

            self.pause(DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException(('Value not found', selector, attribute, expected_value))

    def wait_for_elements_to_disappear_from_dom(self, selector, timeout=DEFAULT_TIMEOUT):
        end_time = time.time() + timeout

        while True:
            elements_to_disappear = self.get_elements_by_css(selector)

            if len(elements_to_disappear) == 0:
                return

            self.pause(DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException(('Element still in DOM', selector))

    def find_element_by_text_in_elements_list_by_css(self, selector, expected_text, timeout=DEFAULT_TIMEOUT):
        element = self.find_element_by_text_in_elements_list_by_css_safe(selector, expected_text, timeout)

        if element:
            return element

        raise MstrException(f'Element not found, selector: {selector}, expected text: {expected_text}')

    def find_element_by_text_in_elements_list_by_css_safe(self, selector, expected_text, timeout=DEFAULT_TIMEOUT):
        end_time = time.time() + timeout

        while True:
            elements = self.get_elements_by_css(selector)

            element = next((item for item in elements if item.text == expected_text), None)
            if element:
                return element

            self.pause(DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        self.log(f'Element not found, selector: {selector}, expected text: {expected_text}')

        return None

    def focus_on_add_in_frame(self):
        end_time = time.time() + DEFAULT_TIMEOUT

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

            self.pause(ELEMENT_SEARCH_RETRY_INTERVAL)

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

        for item in elements:
            if item.text == text:
                return item

        return None

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
