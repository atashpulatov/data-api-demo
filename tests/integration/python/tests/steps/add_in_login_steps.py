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
