from behave import *

from framework.util.assert_util import AssertUtil

@step('I selected "{index}" prompt from the list')
def step_impl(context, index):
    context.pages.prompt_page().select_prompt_from_list(index)