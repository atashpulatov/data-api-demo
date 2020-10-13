from behave import *

from framework.util.assert_util import AssertUtil


@step('I waited for Run button to be enabled')
def step_impl(context):
    context.pages.prompt_page().wait_for_run_button()


@step('I clicked Run button')
def step_impl(context):
    context.pages.prompt_page().click_run_button()


@step('I clicked Run button for prompted dossier if prompts not already answered')
def step_impl(context):
    context.pages.prompt_page().click_run_button_for_prompted_dossier_if_not_answered()


@step('I selected "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().select_answer_for_object_prompt(prompt_number, prompt_name, item)


@step('I unselected "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().unselect_answer_for_object_prompt(prompt_number, prompt_name, item)


@step('I typed "{text}" for "{prompt_number}. {prompt_name}" prompt - value prompt')
def step_impl(context, text, prompt_number, prompt_name):
    context.pages.prompt_page().select_answer_for_value_prompt(prompt_number, prompt_name, text)
