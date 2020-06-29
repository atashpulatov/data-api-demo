from behave import *


@step('I logged in as default user')
def step_impl(context):
    context.pages.add_in_login_page().login('a', '')
