from behave import *

from framework.util.assert_util import AssertUtil


@step('I selected "{item}" as an answer for "{index}" prompt')
def step_impl(context, item, index):
    context.pages.prompt_page().select_answer_for_list_prompt(index, item)


@step('I clicked Run button')
def step_impl(context):
    context.pages.prompt_page().click_run_button()
