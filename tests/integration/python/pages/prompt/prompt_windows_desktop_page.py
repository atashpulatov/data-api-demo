from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException


class PromptWindowsDesktopPage(BaseWindowsDesktopPage):
    PROMPT_MAIN_CONTAINER = "//Group[@AutomationId=\"mstrdossierPromptEditor\"]"
    PROMPT_RUN_BUTTON = '//Button[@Name="Run"][@IsEnabled="True"]'
    PROMPT_RUN_BUTTON_NAME = 'Run'
    PROMPTED_DOSSIER_RUN_BUTTON = 'Run'
    PROMPT_LIST_ELEM = '//Group[contains(@Name,"{}")]/DataItem[@Name="{}"]'
    PROMPT_OBJECT_BOX = '(//DataItem[@Name="{}.{}"]/../following-sibling::Table[starts-with(@AutomationId, "id_mstr")][1]//Group[starts-with(@AutomationId,"ListBlockContents")])[{}]' # selecting specific prompt box
    PROMPT_VALUE_ELEM = '//Edit[starts-with(@AutomationId,"id_mstr") and contains(@AutomationId,"_txt")]'

    def __init__(self):
        super().__init__()

    def wait_for_run_button(self):
        if not self.check_if_element_exists_by_xpath(PromptWindowsDesktopPage.PROMPT_RUN_BUTTON, image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_NAME)):
            raise MstrException(f'Wait button is not enabled')

    def click_run_button(self):
        self.get_element_by_name(
            PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_NAME,
            image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_NAME)
        ).click()

    def click_run_button_for_prompted_dossier_if_not_answered(self):
        if self._check_if_prompts_answer_window_is_open():
            self.get_element_by_name(
                PromptWindowsDesktopPage.PROMPTED_DOSSIER_RUN_BUTTON,
                image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPTED_DOSSIER_RUN_BUTTON+'dossier')
            ).click()

    def _check_if_prompts_answer_window_is_open(self):
        return self.check_if_element_exists_by_xpath(PromptWindowsDesktopPage.PROMPT_MAIN_CONTAINER, timeout=SHORT_TIMEOUT, image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_MAIN_CONTAINER))

    def select_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        """
        Select answer for prompt.

        :param prompt_number: Number that specify prompt to be answered
        :param prompt_name: Name of prompt to be answered
        :param item: String - name of element that needs to be selected
        """

        self._select_prompt_from_list(prompt_number, prompt_name)
        self._check_prompt_name(prompt_number, prompt_name)
        el = self.get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_OBJECT_BOX.format(prompt_number, prompt_name, 1)+'/Group[@Name=\"'+item+'\"]' # can't capture image because it could be in conflict with other prompt boxes
        )
        el.click()
        el.double_click()

    def unselect_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        """
        Unselect answer for prompt.

        :param prompt_number: Number that specify prompt to be answered
        :param prompt_name: Name of prompt to be answered
        :param item: String - name of element that needs to be unselected
        """

        self._select_prompt_from_list(prompt_number, prompt_name)
        self._check_prompt_name(prompt_number, prompt_name)
        el = self.get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_OBJECT_BOX.format(prompt_number, prompt_name, 2)+'/Group[@Name=\"'+item+'\"]' # can't capture image because it could be in conflict with other prompt boxes
        )
        el.click()
        el.double_click()
  
    def _select_prompt_from_list(self, prompt_number, prompt_name):
        self.get_element_by_xpath(
            PromptWindowsDesktopPage.PROMPT_LIST_ELEM.format(prompt_number, prompt_name)
        ).click()

    def _check_prompt_name(self, prompt_number, prompt_name):
        if not self.check_if_element_exists_by_name(
          prompt_number+'.'+prompt_name,
          image_name=self.prepare_image_name('title'+prompt_number+'.'+prompt_name)
        ): 
            raise MstrException(f'Prompt title does not exist: {prompt_number}.{prompt_name}')

    def select_answer_for_value_prompt(self, prompt_number, prompt_name, text):
        self._select_prompt_from_list(prompt_number, prompt_name)

        prompt = self.get_element_by_xpath(
          PromptWindowsDesktopPage.PROMPT_VALUE_ELEM
        )

        prompt.double_click()
        prompt.send_keys(text)
        self.press_tab()
        self.press_tab()
