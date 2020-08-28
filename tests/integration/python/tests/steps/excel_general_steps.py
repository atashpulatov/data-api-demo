from behave import *

from tests.environment import initialize_using_new_session


@step('I closed Excel')
def step_impl(context):
    context.pages.excel_general_page().close_excel()


@step('I changed Excel window size to {height} x {width}')
def step_impl(context, height, width):
    context.pages.excel_general_page().change_excel_window_size(height, width)


@step('I maximixed Excel window')
def step_impl(context):
    context.pages.excel_general_page().maximize_excel_window()


@step('I opened Excel and logged in to Excel using locale "{locale_name}"')
def step_impl(context, locale_name):
    initialize_using_new_session(context, locale_name=locale_name, force_reset_driver=True)
