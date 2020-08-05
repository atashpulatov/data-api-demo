from behave import *

from framework.util.assert_util import AssertUtil


@step('I opened All for Owner category')
def step_impl(context):
    context.pages.filter_panel_page().click_owner_all_panel()


@step('I clicked Select All within All Panel')
def step_impl(context):
    context.pages.filter_panel_page().click_select_all_within_all_panel()


@step('I clicked "{element}" from "{category}" category')
def step_impl(context, element, category):
    context.pages.filter_panel_page().click_element_from_list(category, element)


@step('I clicked first element with 0 objects in All Panel')
def step_impl(context):
    context.pages.filter_panel_page().click_all_panel_first_empty_element()


@step('the first element with 0 objects in All Panel should be selected')
def step_impl(context):
    is_checked = context.pages.filter_panel_page().examine_if_first_empty_element_is_checked()

    AssertUtil.assert_simple(is_checked, True)


@step('the first element with 0 objects in All Panel should NOT be selected')
def step_impl(context):
    is_checked = context.pages.filter_panel_page().examine_if_first_empty_element_is_checked()

    AssertUtil.assert_simple(is_checked, False)
