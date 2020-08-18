from behave import *


@step('I closed Excel')
def step_impl(context):
    context.pages.excel_general_page().close_excel()


@step('I opened Excel and logged in to Excel as "{locale_name}"')
def step_impl(context, locale_name):
    context.pages.excel_general_page().open_excel_and_login(locale_name)
