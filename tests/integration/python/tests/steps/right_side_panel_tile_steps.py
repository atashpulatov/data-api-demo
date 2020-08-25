from behave import *

from framework.util.assert_util import AssertUtil


@step('I closed last notification')
def step_impl(context):
    context.pages.right_panel_tile_page().close_last_notification_on_hover()


@step('I closed notification on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().close_object_notification_on_hover(object_number)


@step('I closed all notifications')
def step_impl(context):
    context.pages.right_panel_tile_page().close_all_notifications_on_hover()


@step('I clicked Edit object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_edit(object_number)


@step('I clicked Duplicate on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_duplicate(object_number)


@step('I clicked Refresh on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_refresh(object_number)


@step('object number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_tile_page().get_object_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I changed object {object_number} name to "{new_object_name}" using icon')
def step_impl(context, object_number, new_object_name):
    context.pages.right_panel_tile_page().change_object_name_using_icon(object_number, new_object_name)


@step('I changed object {object_number} name to "{new_object_name}" using context menu')
def step_impl(context, object_number, new_object_name):
    context.pages.right_panel_tile_page().change_object_name_using_context_menu(object_number, new_object_name)


@step('I removed object {object_number} using icon')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().remove_object_using_icon(object_number)


@step('I removed object {object_number} using context menu')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().remove_object_using_context_menu(object_number)


@step('I waited for object to be refreshed successfully')
def step_impl(contex):
    contex.pages.right_panel_tile_page().wait_for_refresh_object_to_finish_successfully()


@step('I selected excel table for object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().select_excel_table(object_number)
