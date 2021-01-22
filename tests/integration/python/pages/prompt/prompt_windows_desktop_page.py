import time

from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException


class PromptWindowsDesktopPage(BaseWindowsDesktopPage):
    PROMPT_MAIN_CONTAINER = 'mstrdossierPromptEditor'

    PROMPT_RUN_BUTTON_ACCESSIBILITY_ID = 'run'
    PROMPT_RUN_BUTTON_ENABLED_COLORS = ('#1c91dc', '#1384cc')
    PROMPT_RUN_BUTTON_COLOR_OFFSET_X = 10
    PROMPT_RUN_BUTTON_COLOR_OFFSET_Y = 2

    PROMPTED_DOSSIER_RUN_BUTTON = 'Run'
    PROMPTED_DOSSIER_RUN_DOSSIER_BUTTON_IMAGE = PROMPTED_DOSSIER_RUN_BUTTON + 'Dossier'

    PROMPT_LIST_ELEM = '%s\r\n%s'
    PROMPT_WITH_ASTERISK_LIST_ELEM = '*' + PROMPT_LIST_ELEM

    PROMPT_OBJECT_BOX = '(//DataItem[@Name="%s.%s"]' \
                        '/../following-sibling::Table[starts-with(@AutomationId, "id_mstr")][1]' \
                        '//Group[starts-with(@AutomationId, "ListBlockContents")])[%s]/Group[@Name="%s"]'

    PROMPT_VALUE_ELEM = '//DataItem[@Name="%s.%s"]/../following-sibling::Table/DataItem/Edit'
    PROMPT_VALUE_ELEM_COMPLEX = '//DataItem[@Name="%s.%s"]/../following-sibling::Table/DataItem/Table/DataItem/Edit'

    PROMPT_DATE_HOUR = '//DataItem[@Name="%s.%s"]/../following-sibling::Table/DataItem[3]/Edit[1]'
    PROMPT_DATE_MINUTE = '//DataItem[@Name="%s.%s"]/../following-sibling::Table/DataItem[3]/Edit[2]'
    PROMPT_DATE_SECOND = '//DataItem[@Name="%s.%s"]/../following-sibling::Table/DataItem[3]/Edit[3]'

    PROMPT_NAME_SEPARATOR = '.'
    PROMPT_NAME_IMAGE_PREFIX = 'prompt_title_'

    PROMPT_FIELD_LABEL = '//Group[@AutomationId="%s"]/Table[1]/DataItem[3]/Table[1]/DataItem[2]' % PROMPT_MAIN_CONTAINER

    def wait_for_run_button(self):
        end_time = time.time() + Const.LONG_TIMEOUT

        while end_time > time.time():
            run_button = self.get_element_by_accessibility_id(
                PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_ACCESSIBILITY_ID
            )

            color = run_button.pick_color(
                PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_COLOR_OFFSET_X,
                PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_COLOR_OFFSET_Y

            )
            if color in PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_ENABLED_COLORS:
                return True

        raise MstrException(f'Run button not exists or is not enabled.')

    def click_run_button(self):
        self.get_element_by_accessibility_id(
            PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_ACCESSIBILITY_ID
        ).click()

        self.wait_until_element_disappears_by_xpath(
            PromptWindowsDesktopPage.PROMPT_FIELD_LABEL,
            self.get_add_in_main_element()
        )

    def click_run_button_for_prompted_dossier_if_not_answered(self):
        if self._check_if_prompts_answer_window_is_open():
            self.get_element_by_name(
                PromptWindowsDesktopPage.PROMPTED_DOSSIER_RUN_BUTTON,
                image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPTED_DOSSIER_RUN_DOSSIER_BUTTON_IMAGE)
            ).click()

    def _check_if_prompts_answer_window_is_open(self):
        return self.check_if_element_exists_by_accessibility_id(
            PromptWindowsDesktopPage.PROMPT_MAIN_CONTAINER,
            timeout=Const.SHORT_TIMEOUT,
            image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_MAIN_CONTAINER)
        )

    def select_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        """
        Selects answer for prompt by moving elements from the left box to the right box.

        :param prompt_number: Number that specifies prompt to be answered.
        :param prompt_name: Name of the prompt to be answered.
        :param item: Name of the element that needs to be selected.
        """

        self._toggle_answer_for_object_prompt(prompt_number, prompt_name, 1, item)

    def unselect_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        """
        Unelects answer for prompt by moving elements from the right box to the left box.

        :param prompt_number: Number that specifies prompt to be answered.
        :param prompt_name: Name of the prompt to be answered.
        :param item: Name of the element that needs to be unselected.
        """

        self._toggle_answer_for_object_prompt(prompt_number, prompt_name, 2, item)

    def _toggle_answer_for_object_prompt(self, prompt_number, prompt_name, prompt_box_index, item):
        """
        Toggles answer for prompt by moving elements between boxes (1 - left, not selected, 2 - right, selected).

        :param prompt_number: Number that specifies prompt to be answered.
        :param prompt_name: Name of the prompt to be answered.
        :param prompt_box_index: Number that specifies box to select move elements from
        (1 - left, not selected, 2 - right, selected).
        :param item: Name of the element that needs to be toggled.
        """

        self._select_prompt_from_list(prompt_number, prompt_name)

        self._check_prompt_name(prompt_number, prompt_name)

        element = self.get_add_in_main_element().get_element_by_xpath(
            # Can't capture image because it could be in conflict with other prompt boxes.
            PromptWindowsDesktopPage.PROMPT_OBJECT_BOX % (prompt_number, prompt_name, prompt_box_index, item)
        )

        element.click()
        element.double_click()

    def _check_prompt_name(self, prompt_number, prompt_name):
        prompt_name = prompt_number + PromptWindowsDesktopPage.PROMPT_NAME_SEPARATOR + prompt_name

        prompt_exists = self.check_if_element_exists_by_name(
            prompt_name,
            image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_NAME_IMAGE_PREFIX + prompt_name)
        )

        if not prompt_exists:
            raise MstrException(f'Prompt title does not exist: {prompt_number}.{prompt_name}')

    def select_answer_for_value_prompt(self, prompt_number, prompt_name, text):
        prompt = self._get_prompt_for_entering_data(prompt_number, prompt_name)

        prompt.click()
        prompt.send_keys(text)

    def _select_prompt_from_list(self, prompt_number, prompt_name):
        prompt_list_elem_exists = self.get_add_in_main_element().check_if_element_exists_by_name(
            PromptWindowsDesktopPage.PROMPT_LIST_ELEM % (prompt_number, prompt_name),
            timeout=Const.SHORT_TIMEOUT
        )

        prompt_xpath = PromptWindowsDesktopPage.PROMPT_LIST_ELEM if prompt_list_elem_exists \
            else PromptWindowsDesktopPage.PROMPT_WITH_ASTERISK_LIST_ELEM

        self.get_add_in_main_element().get_element_by_name(
            prompt_xpath % (prompt_number, prompt_name)
        ).click()

    def provide_answer_for_date_prompt(self, prompt_number, prompt_name, date, hour, minute, second):
        self._select_prompt_from_list(prompt_number, prompt_name)

        prompt = self.get_add_in_main_element().get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_VALUE_ELEM % (prompt_number, prompt_name)
        )

        prompt.click()
        prompt.send_keys(date)

        prompt_hour = self.get_add_in_main_element().get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_DATE_HOUR % (prompt_number, prompt_name)
        )
        self.press_tab()
        prompt_hour.send_keys(hour)

        prompt_minute = self.get_add_in_main_element().get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_DATE_MINUTE % (prompt_number, prompt_name)
        )
        self.press_tab()
        prompt_minute.send_keys(minute)

        prompt_second = self.get_add_in_main_element().get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_DATE_SECOND % (prompt_number, prompt_name)
        )
        self.press_tab()
        prompt_second.send_keys(second)

    def clear_prompt_input(self, prompt_number, prompt_name):
        prompt = self._get_prompt_for_entering_data(prompt_number, prompt_name)

        prompt.click()
        prompt.send_keys((Keys.CONTROL, 'a', Keys.CONTROL, Keys.DELETE))

    def _get_prompt_for_entering_data(self, prompt_number, prompt_name):
        self._select_prompt_from_list(prompt_number, prompt_name)

        value_prompt_is_regular = self.check_if_element_exists_by_xpath(
            PromptWindowsDesktopPage.PROMPT_VALUE_ELEM % (prompt_number, prompt_name)
        )

        prompt_xpath = PromptWindowsDesktopPage.PROMPT_VALUE_ELEM if value_prompt_is_regular \
            else PromptWindowsDesktopPage.PROMPT_VALUE_ELEM_COMPLEX

        return self.get_add_in_main_element().get_element_by_xpath(
            prompt_xpath % (prompt_number, prompt_name)
        )
