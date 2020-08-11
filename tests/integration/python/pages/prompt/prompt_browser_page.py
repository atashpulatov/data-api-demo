from framework.pages_base.base_browser_page import BaseBrowserPage


class PromptBrowserPage(BaseBrowserPage):
    PROMPT_RUN_BUTTON = '#run'
    PROMPT_INDEX_TABLE = '.mstrPromptTOCHeader'



    def __init__(self):
        super().__init__()

    def select_prompt_from_list(self, index):
        self.focus_on_prompt_frame()


