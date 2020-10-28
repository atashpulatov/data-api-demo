from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked close Add-in button')
def step_impl(context):
    context.pages.excel_menu_page().click_close_add_in_button()


@step('I clicked Add-in icon')
def step_impl(context):
    context.pages.excel_menu_page().click_add_in_elem()


@step('I selected object number {object_number} from Name Box')
def step_impl(context, object_number):
    context.pages.excel_menu_page().select_object_from_name_box(object_number)


@step('item number "{object_number}" in Name Box, ignoring timestamp at the end, was called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.excel_menu_page().is_object_name_in_name_box_correct(object_number, expected_name)

    AssertUtil.assert_simple(result, True)


@step('object number {object_number_1} and object number {object_number_2} in Name Box had different timestamps')
def step_impl(context, object_number_1, object_number_2):
    result = context.pages.excel_menu_page().are_timestamps_different(object_number_1, object_number_2)

    AssertUtil.assert_simple(result, True)
