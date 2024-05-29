from behave import *

from framework.util.assert_util import AssertUtil

@step('I verified that Page-by window is visible')
def step_impl(context):
    is_page_by_window_visible = context.pages.page_by_page().is_page_by_window_visible()
    AssertUtil.assert_simple(is_page_by_window_visible, True)

@step('I verified that Page-by window is NOT visible')
def step_impl(context):
    is_page_by_window_visible = context.pages.page_by_page().is_page_by_window_visible()
    AssertUtil.assert_simple(is_page_by_window_visible, False)
    
@step('I verified that "{dropdown_name}" Page-by dropdown is visible')
def step_impl(context, dropdown_name):
    is_page_by_dropdown_visible = context.pages.page_by_page().is_page_by_dropdown_visible(dropdown_name)
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

@step('I clicked "{button_name}" button without checking results')
def step_impl(context, button_name):
    context.pages.page_by_page().click_button_without_checking(button_name)

@step('I clicked Page-by "{dropdown_name}" dropdown')
def step_impl(context, dropdown_name):
    context.pages.page_by_page().click_page_by_dropdown(dropdown_name)

@step('I selected "{option}" attribute element')
def step_impl(context, option):
    context.pages.page_by_page().click_dropdown_attribute(option)

@step('I closed Page-by "{dropdown_name}" dropdown')
def step_impl(context, dropdown_name):
    context.pages.page_by_page().close_page_by_dropdown(dropdown_name)

@step('I verified that number of pages is {expected_pages_amount} in Page-by grid')
def step_impl(context, expected_pages_amount):
    amount_of_pages_in_grid = context.pages.page_by_page().get_amount_of_pages_in_grid()
    AssertUtil.assert_simple(amount_of_pages_in_grid, int(expected_pages_amount))

@step('I searched for string "{search_string}" in Page-by grid')
def step_impl(context, search_string):
    context.pages.page_by_page().search_for_string(search_string)

@step('I cleared search box in Page-by grid')
def step_impl(context):
    context.pages.page_by_page().clear_search_input()

@step('I selected page number {page_number} from Page-by grid')
def step_impl(context, page_number):
    context.pages.page_by_page().select_page(int(page_number) - 1)

