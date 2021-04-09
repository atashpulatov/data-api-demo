from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException
from selenium.webdriver.common.keys import Keys
from pages.columns_and_filters_selection.columns_and_filters_selection_browser_page import \
    ColumnsAndFiltersSelectionBrowserPage


class PromptBrowserPage(BaseBrowserPage):
    PROMPT_MAIN_CONTAINER_ID = "mstrdossierPromptEditor"
    PROMPT_RUN_BUTTON = '#run'
    PROMPTED_DOSSIER_RUN_BUTTON = '.mstrPromptEditorButtonRun'
    PROMPT_LIST_ELEM = '.mstrPromptTOCListItemIndex'
    PROMPT_OBJECT_SELECTED_ITEM = '.mstrListCartCellSelectedView .mstrListBlockItemName'
    PROMPT_OBJECT_AVAILABLE_ITEM = '.mstrListCartCellAvailableView .mstrListBlockItemName'
    PROMPT_OBJECT_QUESTION_CONTAINER = '.mstrPromptQuestion'

    PROMPT_VALUE_ELEM = '.mstrCalendarAndTimePickerCellTextBox > input'

    PROMPT_QUESTION_TITLE_BAR = '.mstrPromptQuestionTitleBar'
    PROMPT_QUESTION_TITLE_INDEX = PROMPT_QUESTION_TITLE_BAR + ' .mstrPromptQuestionTitleBarIndex'
    PROMPT_QUESTION_TITLE_NAME = PROMPT_QUESTION_TITLE_BAR + ' .mstrPromptQuestionTitleBarTitle'

    def __init__(self):
        super().__init__()

        self.columns_and_filters_selection_browser_page = ColumnsAndFiltersSelectionBrowserPage()

    def _select_prompt_from_list(self, number):
        self.focus_on_prompt_frame()

        prompt_list = self.find_element_by_text_in_elements_list_by_css_safe(
            PromptBrowserPage.PROMPT_LIST_ELEM,
            number,
        )
        prompt_list.click()

    def wait_for_run_button(self):
        self.focus_on_add_in_popup_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            PromptBrowserPage.PROMPT_RUN_BUTTON, 'disabled', None
        )

    def click_run_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(PromptBrowserPage.PROMPT_RUN_BUTTON).click()

    def click_run_button_for_prompted_dossier_if_not_answered(self):
        self.focus_on_dossier_frame()

        if self._check_if_prompts_answer_window_is_open():
            self.get_element_by_css(PromptBrowserPage.PROMPTED_DOSSIER_RUN_BUTTON).click()

    def _check_if_prompts_answer_window_is_open(self):
        return self.check_if_element_exists_by_id(PromptBrowserPage.PROMPT_MAIN_CONTAINER_ID,
                                                  timeout=Const.SHORT_TIMEOUT)

    def select_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_prompt_frame()

        self._change_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_AVAILABLE_ITEM,
            prompt_number,
            prompt_name,
            item
        )

    def unselect_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_prompt_frame()
        
        self._change_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_SELECTED_ITEM,
            prompt_number,
            prompt_name,
            item
        )

    def _change_answer_for_object_prompt(self, selector, prompt_number, prompt_name, item):
        self._select_prompt_from_list(prompt_number)

        self._check_prompt_name(prompt_number, prompt_name)

        answer = self.find_element_by_text_in_elements_list_by_css_safe(
            selector,
            item,
        )  # TODO select prompt for prompt_number

        answer.double_click()

    def select_answer_for_value_prompt(self, prompt_number, text):
        container = self._find_container_by_prompt_number(prompt_number)

        prompt = container.get_element_by_css(PromptBrowserPage.PROMPT_VALUE_ELEM)

        prompt.double_click()
        prompt.send_keys(text)
        self.press_tab()
        self.press_tab()

    def provide_answer_for_date_prompt(self, prompt_number, date, hour, minute, second):
        self._select_prompt_from_list(prompt_number)

        container = self._find_container_by_prompt_number(prompt_number)

        prompt = container.get_element_by_css(PromptBrowserPage.PROMPT_VALUE_ELEM)

        prompt.double_click()
        prompt.send_keys(date)

        prompt_hour = container.get_element_by_css('.mstrHour')
        prompt_hour.double_click()
        prompt_hour.send_keys(hour)

        prompt_hour = container.get_element_by_css('.mstrMinute')
        prompt_hour.double_click()
        prompt_hour.send_keys(minute)

        prompt_hour = container.get_element_by_css('.mstrSecond')
        prompt_hour.double_click()
        prompt_hour.send_keys(second)

    def clear_prompt_input(self, prompt_number):
        self._select_prompt_from_list(prompt_number)

        container = self._find_container_by_prompt_number(prompt_number)

        prompt = container.get_element_by_css(PromptBrowserPage.PROMPT_VALUE_ELEM)

        prompt.click()
        prompt.double_click()
        prompt.send_keys(Keys.BACKSPACE)

    def _check_prompt_name(self, prompt_number, prompt_name):

        title_index_objects = self._get_all_objects_in_prompt_by_selector(PromptBrowserPage.PROMPT_QUESTION_TITLE_INDEX)

        title_name_objects = self._get_all_objects_in_prompt_by_selector(PromptBrowserPage.PROMPT_QUESTION_TITLE_NAME)

        number = prompt_number + '.'

        for title_index, title_name in zip(title_index_objects, title_name_objects):
            if title_index.text == number and title_name.text == prompt_name:
                return

        raise MstrException(f'Could not find prompt: [{number}]. [{prompt_name}] ')

    def _get_all_objects_in_prompt_by_selector(self, object_selector):
        self.focus_on_prompt_frame()

        selected_objects = self.get_elements_by_css(object_selector)

        return selected_objects

    def _find_container_by_prompt_number(self, prompt_number):
        containers = self.get_elements_by_css(PromptBrowserPage.PROMPT_OBJECT_QUESTION_CONTAINER)

        number = prompt_number + '.'

        for container in containers:
            if container.get_attribute('Id'):
                if container.get_element_by_css(PromptBrowserPage.PROMPT_QUESTION_TITLE_INDEX).text == number:
                    return container

        raise MstrException(f'Could not find container with prompt number: [{prompt_number}] ')

