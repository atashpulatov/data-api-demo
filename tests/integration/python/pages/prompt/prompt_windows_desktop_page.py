from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException


class PromptWindowsDesktopPage(BaseWindowsDesktopPage):
    PROMPT_MAIN_CONTAINER = 'mstrdossierPromptEditor'

    PROMPT_RUN_BUTTON = '//Button[@Name="Run"][@IsEnabled="True"]'
    PROMPT_RUN_BUTTON_NAME = 'Run'

    PROMPTED_DOSSIER_RUN_BUTTON = 'Run'
    PROMPTED_DOSSIER_RUN_DOSSIER_BUTTON_IMAGE = PROMPTED_DOSSIER_RUN_BUTTON + 'Dossier'

    PROMPT_LIST_ELEM = '//Group[contains(@Name,"%s")]/DataItem[@Name="%s"]'
    PROMPT_OBJECT_BOX = '(//DataItem[@Name="%s.%s"]/../following-sibling::Table' \
                        '[starts-with(@AutomationId, "id_mstr")][1]' \
                        '//Group[starts-with(@AutomationId, "ListBlockContents")])[%s]/Group[@Name="%s"]'

    PROMPT_VALUE_ELEM = '//Edit[starts-with(@AutomationId,"id_mstr") and contains(@AutomationId, "_txt")]'

    PROMPT_NAME_SEPARATOR = '.'
    PROMPT_NAME_IMAGE_PREFIX = 'prompt_title_'

    PROMPT_FIELD_LABEL = '//Group[@AutomationId=\"mstrdossierPromptEditor\"]/Table[1]/DataItem[3]/Table[1]/DataItem[2]'

    def wait_for_run_button(self):
        run_button_exists = self.check_if_element_exists_by_xpath(
            PromptWindowsDesktopPage.PROMPT_RUN_BUTTON,
            image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_NAME)
        )

        if not run_button_exists:
            raise MstrException(f'Run button not exists or is not enabled.')

    def click_run_button(self):
        prompt_field_label = self.get_add_in_main_element().get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_FIELD_LABEL
        )

        self.get_element_by_name(
            PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_NAME,
            image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_NAME)
        ).click()

        prompt_field_label.wait_until_disappears()

    def click_run_button_for_prompted_dossier_if_not_answered(self):
        if self._check_if_prompts_answer_window_is_open():
            self.get_element_by_name(
                PromptWindowsDesktopPage.PROMPTED_DOSSIER_RUN_BUTTON,
                image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPTED_DOSSIER_RUN_DOSSIER_BUTTON_IMAGE)
            ).click()

    def _check_if_prompts_answer_window_is_open(self):
        return self.check_if_element_exists_by_accessibility_id(
            PromptWindowsDesktopPage.PROMPT_MAIN_CONTAINER,
            timeout=SHORT_TIMEOUT,
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

        element = self.get_element_by_xpath(
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
        self._select_prompt_from_list(prompt_number, prompt_name)

        prompt = self.get_element_by_xpath(PromptWindowsDesktopPage.PROMPT_VALUE_ELEM)

        prompt.double_click()
        prompt.send_keys(text)

        self.press_tab()
        self.press_tab()

    def _select_prompt_from_list(self, prompt_number, prompt_name):
        self.get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_LIST_ELEM % (prompt_number, prompt_name)
        ).click()
