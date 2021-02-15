from behave import *


@step('I initialized Excel')
def step_impl(context):
    context.pages.excel_initialize_page().initialize_excel(context)


@step('I opened Excel and logged in to Excel using locale "{locale_name}"')
def step_impl(context, locale_name):
    context.reset_framework(context)
    context.pages.excel_initialize_page().initialize_using_new_session(context, locale_name)


@step('I closed Excel')
def step_impl(context):
    context.pages.excel_general_page().close_excel()


@step('I changed Excel window size to {width} x {height}')
def step_impl(context, width, height):
    context.pages.excel_general_page().change_excel_window_size(width, height)


@step('I maximized Excel window')
def step_impl(context):
    context.pages.excel_general_page().maximize_excel_window()
