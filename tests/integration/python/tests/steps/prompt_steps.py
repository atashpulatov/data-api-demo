from behave import *

from framework.util.assert_util import AssertUtil


@step('I ensure that Prompt is visible')
def step_impl(context):
    context.pages.prompt_page().ensure_prompt_is_visible()


@step('I clicked Run button')
def step_impl(context):
    context.pages.prompt_page().click_run()


@step('I selected "{index}" prompt from the list')
def step_impl(context, index):
    context.pages.prompt_page().select_prompt_from_list(index)
