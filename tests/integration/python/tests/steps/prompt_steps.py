from behave import *

from framework.util.assert_util import AssertUtil


@step('I waited for Run button to be enabled')
def step_impl(context):
    context.pages.prompt_page().wait_for_run_button()


@step('I clicked Run button')
def step_impl(context):
    context.pages.prompt_page().click_run_button()


@step('I selected "{index}" prompt from the list')
def step_impl(context, index):
    context.pages.prompt_page().select_prompt_from_list(index)
