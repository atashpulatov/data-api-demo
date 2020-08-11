from framework.pages_base.base_browser_page import BaseBrowserPage


class PromptBrowserPage(BaseBrowserPage):
    PROMPT_RUN_BUTTON = '#run'
    PROMPT_INDEX_TABLE = '.mstrPromptTOCHeader'

    def __init__(self):
        super().__init__()

    def ensure_prompt_is_visible(self):
        self.focus_on_import_dossier_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            PromptBrowserPage.PROMPT_RUN_BUTTON,
        )

    def click_run(self):
        self.get_element_by_css(PromptBrowserPage.PROMPT_RUN_BUTTON).click()
