from behave import *

from util.assert_util import AssertUtil


@given("I clicked Import Data button")
def step_impl(context):
    context.pages.right_panel_page().click_import_data_button_element()


@given("I clicked Add Data button")
def step_impl(context):
    context.pages.right_panel_page().click_add_data_button_element()


@step("I closed all notifications")
def step_impl(context):
    context.pages.right_panel_page().close_all_notifications_on_hover()


@step("I closed last notification")
def step_impl(context):
    context.pages.right_panel_page().close_last_notification_on_hover()


@step("I clicked Edit object {object_no}")
def step_impl(context, object_no):
    context.pages.right_panel_page().click_edit(object_no)


@step("I clicked Duplicate on object {object_no}")
def step_impl(context, object_no):
    context.pages.right_panel_page().click_duplicate(object_no)


@then("object number {object_number} should be called '{expected_name}'")
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_page().get_object_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step("I log out")
def step_impl(context):
    context.pages.right_panel_page().logout()
