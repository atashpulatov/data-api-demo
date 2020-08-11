from behave import *

from framework.util.assert_util import AssertUtil

@step('I ensure that Prompt is visible')
def step_impl(context):
    context.pages.prompt_page().ensure_prompt_is_visible()