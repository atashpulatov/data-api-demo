from behave import *


@step('I clicked Import Data button')
def step_impl(context):
    context.pages.right_panel_page().click_import_data_button_element()


@step('I clicked Add Data button')
def step_impl(context):
    context.pages.right_panel_page().click_add_data_button_element()


@step('I log out')
def step_impl(context):
    context.pages.right_panel_page().logout()
