from behave import *

from framework.util.assert_util import AssertUtil

@step('I verified that Page by window is visible')
def step_impl(context):
    is_page_by_window_visible = context.pages.page_by_page().is_page_by_window_visible()
    AssertUtil.assert_simple(is_page_by_window_visible, True)

@step('I verified that Page by window is NOT visible')
def step_impl(context):
    is_page_by_window_visible = context.pages.page_by_page().is_page_by_window_visible()
    AssertUtil.assert_simple(is_page_by_window_visible, False)
    
@step('I verified that Page by dropdown is visible')
def step_impl(context):
    is_page_by_dropdown_visible = context.pages.page_by_page().is_page_by_dropdown_visible()
    AssertUtil.assert_simple(is_page_by_dropdown_visible, True)

@step('I verified that "{button_name}" button is enabled')
def step_impl(context, button_name):
    is_button_enabled = context.pages.page_by_page().is_button_enabled(button_name)
    AssertUtil.assert_simple(is_button_enabled, True)

@step('I verified that "{button_name}" button is disabled')
def step_impl(context, button_name):
    is_button_enabled = context.pages.page_by_page().is_button_enabled(button_name)
    AssertUtil.assert_simple(is_button_enabled, False)

@step('I clicked "{button_name}" button')
def step_impl(context, button_name):
    context.pages.page_by_page().click_button(button_name)

@step('I clicked Page by dropdown')
def step_impl(context):
    context.pages.page_by_page().click_page_by_dropdown()

@step('I selected "{option}" attribute element')
def step_impl(context, option):
    context.pages.page_by_page().click_dropdown_attribute(option)

@step('I closed Page by dropdown')
def step_impl(context):
    context.pages.page_by_page().close_page_by_dropdown()

@step('I verified that "{grid_cell_value}" page is visible in Page by grid')
def step_impl(context, grid_cell_value):
    context.pages.page_by_page().is_value_in_grid_displayed(grid_cell_value)