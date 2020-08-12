from framework.pages_base.base_browser_page import BaseBrowserPage


class PromptBrowserPage(BaseBrowserPage):
    PROMPT_RUN_BUTTON = 'div#popup-wrapper button#run'
    PROMPTED_DOSSIER_RUN_BUTTON = '.mstrPromptEditorButtonRun'
    PROMPT_LIST_ELEM = '.mstrPromptTOCListItemIndex'
    PROMPT_OBJECT_ITEM = '.mstrListBlockItemName'

    PROMPT_ADD_ARROW = '.mstrBGIcon_tbAdd'

    def __init__(self):
        super().__init__()

    def _select_prompt_from_list(self, index):
        self.focus_on_prompt_frame()

        prompt_list = self.find_element_by_text_in_elements_list_by_css_safe(
            PromptBrowserPage.PROMPT_LIST_ELEM,
            index,
        )
        prompt_list.click()

    def wait_for_run_button(self):
        self.wait_for_element_to_have_attribute_value_by_css(
            PromptBrowserPage.PROMPT_RUN_BUTTON, 'disabled', None
        )

    def click_run_button(self):
        self.get_element_by_css(PromptBrowserPage.PROMPT_RUN_BUTTON).click()

    def click_run_button_for_prompted_dossier(self):
        self.focus_on_import_dossier_frame()
        self.get_element_by_css(PromptBrowserPage.PROMPTED_DOSSIER_RUN_BUTTON).click()

    def _click_add_arrow(self):
        self.get_element_by_css(PromptBrowserPage.PROMPT_ADD_ARROW).click()

    def select_answer_for_list_prompt(self, index, item):
        self._select_prompt_from_list(index)

        answer = self.find_element_by_text_in_elements_list_by_css_safe(
            PromptBrowserPage.PROMPT_OBJECT_ITEM,
            item,
        )

        answer.click()

        self._click_add_arrow()
