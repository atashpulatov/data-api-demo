from behave import *


@step('I clicked OK button in Range Taken popup')
def step_impl(context):
    context.pages.range_taken_popup_page().click_ok()


@step('I clicked Cancel button in Range Taken popup')
def step_impl(context):
    context.pages.range_taken_popup_page().click_cancel()


@step('I selected Active Cell option in Range Taken popup')
def step_impl(context):
    context.pages.range_taken_popup_page().select_active_cell()
