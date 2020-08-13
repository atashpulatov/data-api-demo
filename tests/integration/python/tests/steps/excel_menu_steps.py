from behave import *


@step('I clicked close Add-in button')
def step_impl(context):
    context.pages.excel_menu_page().click_close_add_in_button()


@step('I clicked Add-in icon')
def step_impl(context):
    context.pages.excel_menu_page().click_add_in_elem()
