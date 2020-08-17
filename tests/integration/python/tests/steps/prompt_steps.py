from behave import *

from framework.util.assert_util import AssertUtil


@step('I waited for Run button to be enabled')
def step_impl(context):
    context.pages.prompt_page().wait_for_run_button()


@step('I clicked Run button')
def step_impl(context):
    context.pages.prompt_page().click_run_button()


@step('I clicked Run button for prompted dossier')
def step_impl(context):
    context.pages.prompt_page().click_run_button_for_prompted_dossier()


@step('I selected "{item}" as an answer for "{index}" prompt - object prompt')
def step_impl(context, item, index):
    context.pages.prompt_page().select_answer_for_object_prompt(index, item)


@step('I typed "{text}" for "{index}" prompt - value prompt')
def step_impl(context, text, index):
    context.pages.prompt_page().select_answer_for_value_prompt(index, text)
