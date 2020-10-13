from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException

class PromptWindowsDesktopPage(BaseWindowsDesktopPage):
    PROMPT_MAIN_CONTAINER = "//Group[@AutomationId=\"mstrdossierPromptEditor\"]"
    PROMPT_RUN_BUTTON = '//Button[@Name="Run"][@IsEnabled="True"]'
    PROMPT_RUN_BUTTON_NAME = 'Run'
    PROMPTED_DOSSIER_RUN_BUTTON = 'Run'

    def __init__(self):
        super().__init__()

    def wait_for_run_button(self):
        if not self.check_if_element_exists_by_xpath(PromptWindowsDesktopPage.PROMPT_RUN_BUTTON, image_name=self.prepare_image_name(PromptWindowsDesktopPage.PROMPT_RUN_BUTTON_NAME)):
            self.pause(1)
            self.wait_for_run_button()

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

