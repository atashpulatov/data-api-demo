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
    PROMPT_OBJECT_SELECTED_ITEM_ELEM = '.mstrListBlockItem[aria-label="2016"]'
    PROMPT_OBJECT_SELECTED_ITEM_CSS = '.mstrListCartCellSelectedView .mstrListBlockItemName'
    PROMPT_OBJECT_AVAILABLE_ITEM_CSS = '.mstrListCartCellAvailableView .mstrListBlockItemName'
    PROMPT_OBJECT_QUESTION_CONTAINER_CSS = '.mstrPromptQuestion'
    PROMPT_CHECKBOX_OBJECT_SELECTED_ITEM_CSS = '.mstrCheckListItemSelected'
    PROMPT_CHECKBOX_OBJECT_NOT_SELECTED_ITEM_CSS = '.mstrCheckListItem'
    PROMPT_CHECKBOX_OBJECT_ITEM_CSS = PROMPT_CHECKBOX_OBJECT_SELECTED_ITEM_CSS + ',' + \
        PROMPT_CHECKBOX_OBJECT_NOT_SELECTED_ITEM_CSS

    PROMPT_VALUE_ELEM_CSS = '.mstrCalendarAndTimePickerCellTextBox > input'
    PROMPT_HOUR_CSS = '.mstrHour'
    PROMPT_MINUTE_CSS = '.mstrMinute'
    PROMPT_SECOND_CSS = '.mstrSecond'
    PROMPT_CHECKBOX_ITEM_NAME_CSS = '.mstrCheckListItemName'

    PROMPT_QUESTION_TITLE_BAR_CSS = '.mstrPromptQuestionTitleBar'
    PROMPT_QUESTION_TITLE_INDEX_CSS = PROMPT_QUESTION_TITLE_BAR_CSS + ' .mstrPromptQuestionTitleBarIndex'
    PROMPT_QUESTION_TITLE_NAME_CSS = PROMPT_QUESTION_TITLE_BAR_CSS + ' .mstrPromptQuestionTitleBarTitle'

    REPROMPT_BUTTON_CSS = '.mstrd-PromptNavItem'

    PROMPT_DIALOG_TITLE = '.title-bar > span'



    def __init__(self):
        super().__init__()

        self.columns_and_filters_selection_browser_page = ColumnsAndFiltersSelectionBrowserPage()

    def _select_prompt_from_list(self, prompt_number):
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
    
    def wait_for_prompt_dialog(self):
        self.focus_on_add_in_popup_frame()

        self.wait_for_element_to_have_attribute_value_by_css(
            PromptBrowserPage.PROMPT_RUN_BUTTON_CSS, 'disabled', None
        )

    def wait_for_prompt_dialog_ready(self):
        self.focus_on_add_in_popup_frame()
        self.pause(5)
        
    def click_run_button(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(PromptBrowserPage.PROMPT_RUN_BUTTON_CSS).click()

    def click_run_button_for_prompted_dossier_if_not_answered(self):
        self.focus_on_dossier_frame()

        if self._check_if_prompts_answer_window_is_open():
            self.get_element_by_css(PromptBrowserPage.PROMPTED_DOSSIER_RUN_BUTTON_CSS).click()

    def _check_if_prompts_answer_window_is_open(self):
        return self.check_if_element_exists_by_id(PromptBrowserPage.PROMPT_MAIN_CONTAINER_ID,
                                                  timeout=Const.MEDIUM_TIMEOUT)

    def select_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_prompt_frame()

        self._change_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_AVAILABLE_ITEM_CSS,
            prompt_number,
            prompt_name,
            item
        )

    def check_selected_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_prompt_frame()

        el = self._get_selected_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_SELECTED_ITEM_CSS,
            prompt_number,
            prompt_name,
            item
        )

        return el

    def check_available_answer_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_prompt_frame()

        el = self._get_available_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_AVAILABLE_ITEM_CSS,
            prompt_number,
            prompt_name,
            item
        )

        return el

    def check_selected_answer_for_dossier_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_dossier_frame()

        el = self._get_selected_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_SELECTED_ITEM_CSS,
            prompt_number,
            prompt_name,
            item
        )

        return el

    def check_available_answer_for_dossier_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_dossier_frame()

        el = self._get_available_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_AVAILABLE_ITEM_CSS,
            prompt_number,
            prompt_name,
            item
        )

        return el

    def select_answer_for_dossier_object_prompt(self, prompt_number, prompt_name, item):
         self.focus_on_dossier_frame()

         self._change_answer_for_object_prompt(
            PromptBrowserPage.PROMPT_OBJECT_AVAILABLE_ITEM_CSS,
            prompt_number,
            prompt_name,
            item
         )

    def select_checkbox_for_object_prompt(self, prompt_number, prompt_name, item):
        self.focus_on_dossier_frame()

        self._select_prompt_from_list(prompt_number)

        self._check_prompt_name(prompt_number, prompt_name)

        prompt_container = self._find_prompt_container_by_prompt_number(prompt_number)

        prompt_items = prompt_container.get_elements_by_css(PromptBrowserPage.PROMPT_CHECKBOX_OBJECT_ITEM_CSS)
        for prompt_item in prompt_items:
            prompt_item_name = prompt_item.get_element_by_css(PromptBrowserPage.PROMPT_CHECKBOX_ITEM_NAME_CSS).text
            if prompt_item_name == item:
                prompt_item.click()
                return

        raise Exception(f'Could not find prompt option [{item}] in prompt [{prompt_number}. {prompt_name}]')

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

        # self.get_element_by_css(PromptBrowserPage.PROMPT_OBJECT_SELECTED_ITEM_ELEM);
        # .double_click()

        answer = self.find_element_by_text_in_elements_list_by_css_safe(
            selector,
            item,
        )  # TODO select prompt for prompt_number

        answer.double_click()

    def _get_selected_answer_for_object_prompt(self, selector, prompt_number, prompt_name, item):
        self._select_prompt_from_list(prompt_number)

        self._check_prompt_name(prompt_number, prompt_name)

        answer = self.find_element_by_text_in_elements_list_by_css_safe(
            selector,
            item,
        )  # TODO select prompt for prompt_number

        return answer is not None
    
    def _get_available_answer_for_object_prompt(self, selector, prompt_number, prompt_name, item):
        self._select_prompt_from_list(prompt_number)

        self._check_prompt_name(prompt_number, prompt_name)

        answer = self.find_element_by_text_in_elements_list_by_css_safe(
            selector,
            item,
        )  # TODO select prompt for prompt_number

        return answer is not None
        
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

        print ('name_found_in_prompt_container', name_found_in_prompt_container)

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

    def click_reprompt_button(self):
        self.focus_on_dossier_frame()

        self.get_element_by_css(PromptBrowserPage.REPROMPT_BUTTON_CSS).click()

    def check_prompt_dialog_title(self, obj_number, total_obj_number, object_name):
        self.focus_on_add_in_popup_frame()

        actual_text = self.get_element_by_css(PromptBrowserPage.PROMPT_DIALOG_TITLE).text
        expected_text = f"Reprompt {obj_number} of {total_obj_number} > {object_name}"
        print(actual_text)
        print(expected_text)

        return actual_text == expected_text
    
    def save_new_answer(self, name):
        self.focus_on_prompt_frame()
        self.get_element_by_xpath("//label[contains(.,'Save selection as a new answer after running')]").click()
        inputBox = self.get_element_by_xpath("//input[@type='textbox']")
        inputBox.click()
        inputBox.send_keys(name)

    def save_new_answer_as_default(self, name):
        self.save_new_answer(name)
        self.get_element_by_xpath("//label[contains(.,'Set as default answer')]").click()
    
    def loadPersonalAnswer(self, name):
        self.focus_on_prompt_frame()
        self.get_element_by_class_name("mstrListPulldown").click()
        self.get_element_by_xpath(f"//div[contains(@aria-label, '{name}')]").click()

    def renamePersonalAnswer(self, oldName, newName):
        self.focus_on_prompt_frame()
        self.get_element_by_class_name("mstrListPulldown").click()
        self.get_element_by_xpath("//a[contains(.,'Manage Saved Answers')]").click()
        self.get_element_by_xpath(f"//div[contains(@aria-label, '{oldName}')]").click()
        self.get_element_by_id("mstr-personal-answer-rename-button").click()
        inputBox = self.get_element_by_id("form_in_modal_rename")
        inputBox.click()
        inputBox.send_keys((Keys.CONTROL, 'a', Keys.DELETE))
        inputBox.send_keys(newName)
        self.get_element_by_xpath("//span[contains(.,'OK')]").click()

    def deletePersonalAnswer(self, name):
        self.focus_on_prompt_frame()
        self.get_element_by_class_name("mstrListPulldown").click()
        self.get_element_by_xpath("//a[contains(.,'Manage Saved Answers')]").click()
        self.get_element_by_xpath(f"//div[contains(@aria-label, '{name}')]").click()
        self.get_element_by_id("mstr-personal-answer-delete-button").click()
        self.get_element_by_xpath("//button[contains(.,'Yes')]").click()
        
    def setDefaultPersonalAnswer(self, name):
        self.focus_on_prompt_frame()
        self.get_element_by_class_name("mstrListPulldown").click()
        self.get_element_by_xpath("//a[contains(.,'Manage Saved Answers')]").click()
        self.get_element_by_xpath(f"//div[contains(@aria-label, '{name}')]").click()
        self.get_element_by_id("mstr-personal-answer-set-button").click()

    def clearPersonalAnswer(self):
        self.focus_on_prompt_frame()
        try:
            self.deletePersonalAnswer("2020")
        except:
            pass
        try:
            self.deletePersonalAnswer("2021")
        except:
            pass
    
    def uncheckSaveAnswer(self):
        self.focus_on_prompt_frame()
        checkbox = self.get_element_by_xpath("//input[contains(@class,'mstrPromptSaveOneAnswerCheckbox') and not(contains(@name, 'autoclose'))]")
        if checkbox.get_attribute('checked'):
            self.get_element_by_xpath("//label[contains(.,'Remember this answer')]").click()

    def checkSaveAnswer(self):
        self.focus_on_prompt_frame()
        checkbox = self.get_element_by_xpath("//input[contains(@class,'mstrPromptSaveOneAnswerCheckbox') and not(contains(@name, 'autoclose'))]")
        if not checkbox.get_attribute('checked'):
            self.get_element_by_xpath("//label[contains(.,'Remember this answer')]").click()