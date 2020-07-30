from behave import *

from util.assert_util import AssertUtil


@step('I opened owners all panel')
def step_impl(context):
    context.pages.filter_panel_page().click_owner_all_panel()