from behave import *
from framework.util.assert_util import AssertUtil


@step('I clicked OK button in Range Taken popup')
def step_impl(context):
    context.pages.range_taken_popup_page().click_ok()


@step('I clicked Cancel button in Range Taken popup')
def step_impl(context):
    context.pages.range_taken_popup_page().click_cancel()


@step('I selected Active Cell option in Range Taken popup')
def step_impl(context):
    context.pages.range_taken_popup_page().select_active_cell()


@step('I verified "New  Sheet" is selected')
def step_impl(context):
    is_new_sheet_checked = context.pages.range_taken_popup_page().verify_that_new_sheet_is_checked()

    AssertUtil.assert_simple(is_new_sheet_checked, True)
