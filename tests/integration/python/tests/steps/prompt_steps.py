from behave import *

from framework.util.assert_util import AssertUtil

@step('I selected "{item}" as an answer for "{index}" prompt')
def step_impl(context, item, index):
    context.pages.prompt_page().select_answer_for_list_prompt(index, item)