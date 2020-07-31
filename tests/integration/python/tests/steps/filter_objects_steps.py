from behave import *

from util.assert_util import AssertUtil


@step('I opened owners all panel')
def step_impl(context):
    context.pages.filter_panel_page().click_owner_all_panel()


@step('I selected all within all panel')
def step_impl(context):
    context.pages.filter_panel_page().click_select_all_within_all_panel()


@step('I clicked "{element}" from "{category}"')
def step_impl(context, category, element):
    context.pages.filter_panel_page().click_element_from_list(category, element)
