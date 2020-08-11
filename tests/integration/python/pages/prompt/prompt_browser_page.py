from framework.pages_base.base_browser_page import BaseBrowserPage


class PromptBrowserPage(BaseBrowserPage):
    PROMPT_RUN_BUTTON = '#run'
    PROMPT_LIST_ELEM = '.mstrPromptTOCListItemIndex'

    def __init__(self):
        super().__init__()

    def select_prompt_from_list(self, index):
        self.focus_on_prompt_frame()

        prompt_list = self.find_element_by_text_in_elements_list_by_css_safe(
            PromptBrowserPage.PROMPT_LIST_ELEM,
            index,
        )
        prompt_list.click()

    def click_run(self):
        self.get_element_by_css(PromptBrowserPage.PROMPT_RUN_BUTTON).click()
