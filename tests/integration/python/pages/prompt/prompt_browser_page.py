from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.exception.mstr_exception import MstrException
from pages.columns_and_filters_selection.columns_and_filters_selection_browser_page import \
    ColumnsAndFiltersSelectionBrowserPage


class PromptBrowserPage(BaseBrowserPage):
    PROMPT_MAIN_CONTAINER_ID = "mstrdossierPromptEditor"
    PROMPT_RUN_BUTTON_CSS = '#run'
    PROMPTED_DOSSIER_RUN_BUTTON_CSS = '.mstrPromptEditorButtonRun'
    PROMPT_LIST_ELEM_CSS = '.mstrPromptTOCListItemIndex'
    PROMPT_OBJECT_SELECTED_ITEM_CSS = '.mstrListCartCellSelectedView .mstrListBlockItemName'
    PROMPT_OBJECT_AVAILABLE_ITEM_CSS = '.mstrListCartCellAvailableView .mstrListBlockItemName'
    PROMPT_OBJECT_QUESTION_CONTAINER_CSS = '.mstrPromptQuestion'

    PROMPT_VALUE_ELEM_CSS = '.mstrCalendarAndTimePickerCellTextBox > input'
    PROMPT_HOUR_CSS = '.mstrHour'
    PROMPT_MINUTE_CSS = '.mstrMinute'
    PROMPT_SECOND_CSS = '.mstrSecond'

    PROMPT_QUESTION_TITLE_BAR_CSS = '.mstrPromptQuestionTitleBar'
    PROMPT_QUESTION_TITLE_INDEX_CSS = PROMPT_QUESTION_TITLE_BAR_CSS + ' .mstrPromptQuestionTitleBarIndex'
    PROMPT_QUESTION_TITLE_NAME_CSS = PROMPT_QUESTION_TITLE_BAR_CSS + ' .mstrPromptQuestionTitleBarTitle'

    def __init__(self):
        super().__init__()

        self.columns_and_filters_selection_browser_page = ColumnsAndFiltersSelectionBrowserPage()

    def _select_prompt_from_list(self, prompt_number):
        self.focus_on_prompt_frame()

        prompt_list = self.find_element_by_text_in_elements_list_by_css_safe(
            PromptBrowserPage.PROMPT_LIST_ELEM_CSS,
            prompt_number,
        )
        prompt_list.click()

    def wait_for_run_button(self):
        self.focus_on_add_in_popup_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            PromptBrowserPage.PROMPT_RUN_BUTTON_CSS, 'disabled', None
        )

    def is_run_button_present_and_enabled(self):
        try:
            self.focus_on_add_in_popup_frame()
            elements = self.get_elements_by_css(PromptBrowserPage.PROMPT_RUN_BUTTON_CSS)
            if len(elements) == 0:
                return False
            return elements[0].is_enabled_by_attribute_html()
            # use negated is_enabled_by_attribute_html function
        except MstrException:
            return False

    def click_run_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(PromptBrowserPage.PROMPT_RUN_BUTTON_CSS).click()

    def click_run_button_for_prompted_dossier_if_not_answered(self):
        self.focus_on_dossier_frame()

        if self._check_if_prompts_answer_window_is_open():
            self.get_element_by_css(PromptBrowserPage.PROMPTED_DOSSIER_RUN_BUTTON_CSS).click()

    def wait_for_run_button_for_prompted_dossier(self):
        self.focus_on_dossier_frame()
        self.wait_for_element_to_have_attribute_value_by_css(
            PromptBrowserPage.PROMPTED_DOSSIER_RUN_BUTTON_CSS, 'disabled', None
        )

    def _check_if_prompts_answer_window_is_open(self):
        return self.check_if_element_exists_by_id(PromptBrowserPage.PROMPT_MAIN_CONTAINER_ID,
                                                  timeout=Const.SHORT_TIMEOUT)

    def select_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_prompt_frame()

        self._change_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_AVAILABLE_ITEM_CSS,
            prompt_number,
            prompt_name,
            item
        )

    def unselect_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_prompt_frame()

        self._change_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_SELECTED_ITEM_CSS,
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

    def select_answer_for_value_prompt(self, prompt_number, prompt_name, text):
        self._select_prompt_from_list(prompt_number)

        self._check_prompt_name(prompt_number, prompt_name)

        prompt_container = self._find_prompt_container_by_prompt_number(prompt_number)

        prompt = prompt_container.get_element_by_css(PromptBrowserPage.PROMPT_VALUE_ELEM_CSS)

        prompt.double_click()
        prompt.send_keys(text)

    def provide_answer_for_date_prompt(self, prompt_number, prompt_name, date, hour, minute, second):
        self._select_prompt_from_list(prompt_number)

        self._check_prompt_name(prompt_number, prompt_name)

        prompt_container = self._find_prompt_container_by_prompt_number(prompt_number)

        prompt = prompt_container.get_element_by_css(PromptBrowserPage.PROMPT_VALUE_ELEM_CSS)

        prompt.double_click()
        prompt.send_keys(date)

        prompt_hour = prompt_container.get_element_by_css(PromptBrowserPage.PROMPT_HOUR_CSS)
        prompt_hour.double_click()
        prompt_hour.send_keys(hour)

        prompt_hour = prompt_container.get_element_by_css(PromptBrowserPage.PROMPT_MINUTE_CSS)
        prompt_hour.double_click()
        prompt_hour.send_keys(minute)

        prompt_hour = prompt_container.get_element_by_css(PromptBrowserPage.PROMPT_SECOND_CSS)
        prompt_hour.double_click()
        prompt_hour.send_keys(second)

    def clear_prompt_input(self, prompt_number, prompt_name):
        self._select_prompt_from_list(prompt_number)

        self._check_prompt_name(prompt_number, prompt_name)

        prompt_container = self._find_prompt_container_by_prompt_number(prompt_number)

        prompt = prompt_container.get_element_by_css(PromptBrowserPage.PROMPT_VALUE_ELEM_CSS)

        prompt.click()
        prompt.send_keys((Keys.CONTROL, 'a', Keys.DELETE))

    def _check_prompt_name(self, prompt_number, prompt_name):
        prompt_container = self._find_prompt_container_by_prompt_number(prompt_number)

        name_found_in_prompt_container = prompt_container.get_element_by_css(
            PromptBrowserPage.PROMPT_QUESTION_TITLE_NAME_CSS
        ).text

        if name_found_in_prompt_container == prompt_name:
            return

        raise MstrException(f'Could not find prompt: [{prompt_number}. {prompt_name}] ')

    def _find_prompt_container_by_prompt_number(self, prompt_number):
        containers = self.get_elements_by_css(PromptBrowserPage.PROMPT_OBJECT_QUESTION_CONTAINER_CSS)

        number = prompt_number + '.'

        for container in containers:
            if container.get_id_by_attribute() != '':
                if container.get_element_by_css(PromptBrowserPage.PROMPT_QUESTION_TITLE_INDEX_CSS).text == number:
                    return container

        raise MstrException(f'Could not find container with prompt number: [{prompt_number}]')
