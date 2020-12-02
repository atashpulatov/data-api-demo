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


@step('I closed all warning notifications')
def step_impl(context):
    context.pages.right_panel_tile_page().close_all_warning_notifications()


@step('I clicked Edit object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_edit(object_number)


@step('I clicked Duplicate on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_duplicate(object_number)


@step('I clicked Refresh on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_refresh(object_number)


@step('I clicked on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_object_number(object_number)


@step('object number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_tile_page().get_object_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('name tooltip for object number {object_number} should display "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_tile_page().get_object_name_from_tooltip(object_number)

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


@step('I waited for object to be imported successfully')
def step_impl(contex):
    contex.pages.right_panel_tile_page().wait_for_import_object_to_finish_successfully()


@step('I waited for object to be duplicated successfully')
def step_impl(contex):
    contex.pages.right_panel_tile_page().wait_for_duplicate_object_to_finish_successfully()


@step('I waited for object operation to complete successfully with message: "{expected_message}"')
def step_impl(contex, expected_message):
    contex.pages.right_panel_tile_page().wait_for_operation_to_finish_successfully_with_message(expected_message)


@step('I waited for all progress notifications to disappear')
def step_impl(context):
    context.pages.right_panel_tile_page().wait_for_progress_notifications_to_disappear()


@step('object {object_number} icon bar is visible')
def step_impl(context, object_number):
    is_icon_bar_visible = context.pages.right_panel_tile_page().is_icon_bar_visible(object_number)

    AssertUtil.assert_simple(is_icon_bar_visible, True)


@step('I selected {object_number} using object checkbox')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_checkbox_for_object_selection(object_number)


@step('I canceled object {object_number} pending action')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_cancel_on_pending_action(object_number)


@step('object {object_number} action in progress name is "{object_action}"')
def step_impl(context, object_number, object_action):
    action_in_progress_name = context.pages.right_panel_tile_page().get_object_action_in_progress_name(object_number)

    AssertUtil.assert_simple(action_in_progress_name, object_action)


@step('object {object_number} action in progress is executed on total "{total_rows_expected}"')
def step_impl(context, object_number, total_rows_expected):
    total_rows = context.pages.right_panel_tile_page().get_object_action_in_progress_total_rows_count(object_number)

    AssertUtil.assert_simple(total_rows, total_rows_expected)


@step('object {object_number} action displays percentage progress')
def step_impl(context, object_number):
    is_percentage_displayed = context.pages.right_panel_tile_page().verify_object_action_displays_progress_percentage(object_number)

    AssertUtil.assert_simple(is_percentage_displayed, True)


@step('object {object_number} action is pending')
def step_impl(context, object_number):
    is_action_pending = context.pages.right_panel_tile_page().verify_object_action_is_pending(object_number)

    AssertUtil.assert_simple(is_action_pending, True)


@step('object {object_number} has displayed message "{object_message}"')
def step_impl(context, object_number, object_message):
    displayed_message = context.pages.right_panel_tile_page().get_object_action_in_progress_name(object_number)

    AssertUtil.assert_simple(displayed_message, object_message)


@step('object {object_number} has no message displayed')
def step_impl(context, object_number):
    is_message_displayed = context.pages.right_panel_tile_page().verify_object_has_message_displayed(object_number)

    AssertUtil.assert_simple(is_message_displayed, False)


@step('I waited for object {object_number} to have message on succesful operation: "{expected_message}"')
def step_impl(contex, object_number, expected_message):
    contex.pages.right_panel_tile_page().wait_for_object_operation_to_finish_successfully_with_message(object_number, expected_message)
