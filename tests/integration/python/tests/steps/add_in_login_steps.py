from behave import *

from framework.util.config_util import ConfigUtil


@step('I logged in as default user')
def step_impl(context):
    username, password = ConfigUtil.get_add_in_environment_default_credentials()

    context.pages.add_in_login_page().login(username, password)


@step('I logged in with username "{user_name}" and empty password')
def step_impl(context, user_name):
    context.pages.add_in_login_page().login(user_name, '')


@step('I logged in with username "{user_name}" and password "{password}"')
def step_impl(context, user_name, password):
    context.pages.add_in_login_page().login(user_name, password)


@step('I verified that I see an authentication error and clicked OK')
def step_impl(context):
    context.pages.add_in_login_page().verify_authentication_error_and_click_ok()


@step('I verified that I see a "No MicroStrategy for Office privileges" message and I click Try Again')
def step_impl(context):
    context.pages.add_in_login_page().verify_plugin_privileges_message_and_click_try_again()


@step('I closed Log In popup')
def step_impl(context):
    context.pages.add_in_login_page().close_login_pop_up()
    
