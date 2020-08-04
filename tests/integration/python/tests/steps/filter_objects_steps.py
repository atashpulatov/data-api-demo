from behave import *

from util.util import Util
from util.assert_util import AssertUtil


@step('I opened owners all panel')
def step_impl(context):
    context.pages.filter_panel_page().click_owner_all_panel()


@step('I selected all within all panel')
def step_impl(context):
    context.pages.filter_panel_page().click_select_all_within_all_panel()


@step('I clicked "{element}" from "{category}"')
def step_impl(context, element, category):
    context.pages.filter_panel_page().click_element_from_list(category, element)


@step('I clicked first empty element in all panel')
def step_impl(context):
    context.pages.filter_panel_page().click_all_panel_first_empty_element()


@step('the first empty element in all panel should be selected')
def step_impl(context):
    is_checked = context.pages.filter_panel_page().examine_if_first_empty_element_is_checked()
    AssertUtil.assert_simple(is_checked, True)


@step('the first empty element in all panel should NOT be selected')
def step_impl(context):
    is_checked = context.pages.filter_panel_page().examine_if_first_empty_element_is_checked()
    AssertUtil.assert_simple(is_checked, False)
