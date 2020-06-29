import time

from selenium.common.exceptions import NoSuchFrameException, NoSuchWindowException

from pages.base_page import BasePage
from util.const import DEFAULT_WAIT_BETWEEN_CHECKS, DEFAULT_TIMEOUT, DEFAULT_WAIT_AFTER_EXCEPTION
from util.exception.MstrException import MstrException
from util.util import Util


class BaseBrowserPage(BasePage):
    EXCEL_FRAME_ELEM = 'WebApplicationFrame'

    IMPORT_DATA_POPUP_FRAME_ELEM = '#WACDialogOuterContainer iframe'

    IMPORT_DOSSIER_FRAME_ELEM = 'iframe[src*="app.embedded=true"]'

    ADD_IN_FRAME_ELEM = '.AddinIframe'
    ADD_IN_ROOT_ELEM = 'root'

    def switch_to_window_by_index(self, index):
        window_handles = self.driver.window_handles

        self.driver.switch_to.window(window_handles[index])

    def switch_to_excel_initial_window(self):
        self.switch_to_window_by_index(0)

    def switch_to_excel_workbook_window(self):
        self.switch_to_window_by_index(1)

    def switch_to_login_pop_up_window(self):
        self.switch_to_window_by_index(2)

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

            self.pause(DEFAULT_WAIT_AFTER_EXCEPTION)

            if time.time() > end_time:
                raise MstrException('Cannot focus on excel frame')

    def focus_on_import_data_pop_up_frame(self):
        self.focus_on_excel_frame()

        popup_frame_element = self.get_frame_element_by_css(BaseBrowserPage.IMPORT_DATA_POPUP_FRAME_ELEM)

        self._switch_to_frame(popup_frame_element)

    def focus_on_import_dossier_frame(self):
        self.focus_on_add_in_frame()

        dossier_frame_element = self.get_frame_element_by_css(BaseBrowserPage.IMPORT_DOSSIER_FRAME_ELEM)

        self._switch_to_frame(dossier_frame_element)

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

    def find_element_by_text_in_elements_list_by_css(self, selector, expected_text, timeout=DEFAULT_TIMEOUT):
        end_time = time.time() + timeout
        while True:
            elements = self.get_elements_by_css(selector)

            element = next((item for item in elements if item.text == expected_text), None)
            if element:
                return element

            self.pause(DEFAULT_WAIT_BETWEEN_CHECKS)

            if time.time() > end_time:
                break

        raise MstrException('No Attribute found: %s' % expected_text)

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

            self.pause(DEFAULT_WAIT_AFTER_EXCEPTION)

            if time.time() > end_time:
                break

        raise MstrException('failed to focus on AddIn iframe')
