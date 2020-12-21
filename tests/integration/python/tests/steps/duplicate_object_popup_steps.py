from behave import *


@step('I clicked Import button in Duplicate popup')
def step_impl(context):
    context.pages.duplicate_object_popup_page().click_import()


@step('I clicked Import button in Duplicate popup without checking results')
def step_impl(context):
    context.pages.duplicate_object_popup_page().click_import_without_check()


@step('I clicked Edit button in Duplicate popup')
def step_impl(context):
    context.pages.duplicate_object_popup_page().click_edit()


@step('I selected Active Cell option in Duplicate popup')
def step_impl(context):
    context.pages.duplicate_object_popup_page().select_active_cell()
