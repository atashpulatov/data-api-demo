import json

from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked close plugin button')
def step_impl(context):
    context.pages.excel_menu_page().click_close_plugin_button()


@step('I clicked plugin icon')
def step_impl(context):
    context.pages.excel_menu_page().click_add_in_elem()
