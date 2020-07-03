from behave import *

from util.assert_util import AssertUtil


@step('I clicked Import Data button')
def step_impl(context):
    context.pages.right_panel_page().click_import_data_button_element()


@step('I clicked Add Data button')
def step_impl(context):
    context.pages.right_panel_page().click_add_data_button_element()


@step('I closed all notifications')
def step_impl(context):
    context.pages.right_panel_page().close_all_notifications_on_hover()


@step('I closed last notification')
def step_impl(context):
    context.pages.right_panel_page().close_last_notification_on_hover()


@step('I clicked Edit object {object_no}')
def step_impl(context, object_no):
    context.pages.right_panel_page().click_edit(object_no)


@step('I clicked Duplicate on object {object_no}')
def step_impl(context, object_no):
    context.pages.right_panel_page().click_duplicate(object_no)


@step('I clicked Refresh on object {object_no}')
def step_impl(context, object_no):
    context.pages.right_panel_page().click_refresh(object_no)


@step('object number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_page().get_object_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I changed object {object_number} name to "{new_object_name}" using icon')
def step_impl(context, object_number, new_object_name):
    context.pages.right_panel_page().change_object_name_using_icon(object_number, new_object_name)


@step('I changed object {object_number} name to "{new_object_name}" using context menu')
def step_impl(context, object_number, new_object_name):
    context.pages.right_panel_page().change_object_name_using_context_menu(object_number, new_object_name)


@step('I removed object {object_number} using icon')
def step_impl(context, object_number):
    context.pages.right_panel_page().remove_object_using_icon(object_number)


@step('I removed object {object_number} using context menu')
def step_impl(context, object_number):
    context.pages.right_panel_page().remove_object_using_context_menu(object_number)


@step('I log out')
def step_impl(context):
    context.pages.right_panel_page().logout()
