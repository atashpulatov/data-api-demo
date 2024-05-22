from behave import *

from framework.util.assert_util import AssertUtil
import html


@step('I closed last notification')
def step_impl(context):
    context.pages.right_panel_tile_page().close_last_notification_on_hover(context.reset_framework, context)


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


@step('I hovered over Edit button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().hover_edit(object_number)


@step('I clicked Duplicate on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_duplicate(object_number)


@step('I clicked Refresh on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_refresh(object_number)

@step('I clicked Refresh on without prompt object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_refresh_without_prompt(object_number)

@step('I clicked Reprompt on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_reprompt(object_number)


@step('I hovered over Refresh button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().hover_refresh(object_number)


@step('I hovered over Reprompt button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().hover_reprompt(object_number)

@step('I clicked select all checkbox')
def step_impl(context):
    context.pages.right_panel_tile_page().click_select_all()

@step('I clicked Reprompt button for select all')
def step_impl(context):
    context.pages.right_panel_tile_page().click_reprompt_for_select_all()

@step('I clicked Refresh button for select all')
def step_impl(context):
    context.pages.right_panel_tile_page().click_refresh_for_select_all()

@step('I verified that tooltip "{expected_tooltip_text}" is displayed on object {object_number}')
def step_impl(context, expected_tooltip_text, object_number):
    tooltip_text = context.pages.right_panel_tile_page().get_tooltip_text(object_number)

    AssertUtil.assert_simple(tooltip_text, expected_tooltip_text)


@step('I clicked on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_object_number(object_number)


@step('I double clicked on the name of object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().double_click_on_name_of_object_number(object_number)


@step('I hovered over object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().hover_over_object_number(object_number)


@step('I hovered over the name of object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().hover_over_name_of_object_number(object_number)


@step('I verified that object number {object_number} is called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_tile_page().get_object_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I verified name of object {object_number} is highlighted with color "{expected_color}"')
def step_impl(context, object_number, expected_color):
    highlight_color = context.pages.right_panel_tile_page().get_highlight_color_of_object_number(object_number)

    AssertUtil.assert_simple(highlight_color, expected_color)


@step('after double clicking I verified name of object {object_number} is highlighted with color "{expected_color}"')
def step_impl(context, object_number, expected_color):
    highlight_color = context.pages.right_panel_tile_page().get_highlight_color_of_object_number_after_double_click(
        object_number
    )

    AssertUtil.assert_simple(highlight_color, expected_color)


@step('I verified that name tooltip for object number {object_number} displays "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_tile_page().get_object_name_from_tooltip(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I verified that path name for object number {object_number} displays "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_tile_page().get_object_path(object_number)
    AssertUtil.assert_simple(result, expected_name)

@step('I verified that path name in inner html for object number {object_number} displays "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.right_panel_tile_page().get_object_path_from_innerHtml(object_number)
    AssertUtil.assert_simple(html.unescape(result), expected_name)

@step('I verified that sub title for object number {object_number} displays "{expected_title}"')
def step_impl(context, object_number, expected_title):
    result = context.pages.right_panel_tile_page().get_object_sub_title(expected_title)

    AssertUtil.assert_simple(html.unescape(result.get_attribute("innerHTML")), expected_title)

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

@step('I duplicate object {object_number} using context menu without prompt')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().duplicate_object_using_context_menu_without_prompt(object_number)

@step('I edit object {object_number} using context menu without prompt')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().edit_object_using_context_menu_without_prompt(object_number)

@step('I waited for object to be refreshed successfully')
def step_impl(context):
    context.pages.right_panel_tile_page().wait_for_refresh_object_to_finish_successfully()


@step('I waited for object to be imported successfully')
def step_impl(context):
    context.pages.right_panel_tile_page().wait_for_import_object_to_finish_successfully()

@step('I hover over import successfull message')
def step_impl(context):
    context.pages.right_panel_tile_page().hover_over_import_successful_message()


@step('I waited for object to be duplicated successfully')
def step_impl(context):
    context.pages.right_panel_tile_page().wait_for_duplicate_object_to_finish_successfully()


@step('I waited for object operation to complete successfully with message "{expected_message}"')
def step_impl(context, expected_message):
    context.pages.right_panel_tile_page().wait_for_operation_to_finish_successfully_with_message(expected_message)


@step('I waited for all progress notifications to disappear')
def step_impl(context):
    context.pages.right_panel_tile_page().wait_for_progress_notifications_to_disappear()


@step('I verified that object {object_number} icon bar is visible')
def step_impl(context, object_number):
    is_icon_bar_visible = context.pages.right_panel_tile_page().is_icon_bar_visible(object_number)

    AssertUtil.assert_simple(is_icon_bar_visible, True)


@step('I selected object {object_number} using object checkbox')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_checkbox_for_object_selection(object_number)


@step('I canceled object {object_number} pending action')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_cancel_on_pending_action(object_number)


@step('I verified that the object {object_number} action in progress name is "{object_action}"')
def step_impl(context, object_number, object_action):
    action_in_progress_name = context.pages.right_panel_tile_page().get_object_action_in_progress_name(object_number)

    AssertUtil.assert_simple(action_in_progress_name, object_action)


@step('I verified that the object {object_number} action in progress is executed on total "{total_rows_expected}"')
def step_impl(context, object_number, total_rows_expected):
    total_rows = context.pages.right_panel_tile_page().get_object_action_in_progress_total_rows_count(object_number)

    AssertUtil.assert_simple(total_rows, total_rows_expected)


@step('I verified that the object {object_number} action displayed percentage progress')
def step_impl(context, object_number):
    is_percentage_displayed = context.pages.right_panel_tile_page().verify_object_action_displays_progress_percentage(
        object_number
    )

    AssertUtil.assert_simple(is_percentage_displayed, True)


@step('I verified that the object {object_number} action is pending')
def step_impl(context, object_number):
    is_action_pending = context.pages.right_panel_tile_page().verify_object_action_is_pending(object_number)

    AssertUtil.assert_simple(is_action_pending, True)


@step('I verified that the object {object_number} has displayed message "{object_message}"')
def step_impl(context, object_number, object_message):
    displayed_message = context.pages.right_panel_tile_page().get_object_action_in_progress_name(object_number)

    AssertUtil.assert_simple(displayed_message, object_message)


@step('I verified that the object {object_number} tile has no popup displayed')
def step_impl(context, object_number):
    is_message_displayed = context.pages.right_panel_tile_page().verify_object_has_popup_displayed(object_number)

    AssertUtil.assert_simple(is_message_displayed, False)


@step('I waited for object {object_number} to have message on successful operation: "{expected_message}"')
def step_impl(context, object_number, expected_message):
    context.pages.right_panel_tile_page().wait_for_object_operation_to_finish_successfully_with_message(
        object_number,
        expected_message
    )

@step('I verified that the object {object_number} action in warning box is "{warning_message}"')
def step_impl(context, object_number, warning_message):
    action_in_progress_name = context.pages.right_panel_tile_page().get_object_action_in_progress_name(object_number)
    AssertUtil.assert_not_equal(action_in_progress_name, warning_message)

@step('I verified that right click context menu has {expected_menu_items} items')
def step_impl(context, expected_menu_items):
    actual_menu_items = context.pages.right_panel_tile_page().get_right_click_menu_items()
    AssertUtil.assert_simple(actual_menu_items, int(expected_menu_items))

@step('I verified that context menu has "{expected_menu_items}" button')
def step_impl(context, expected_menu_items):
    found = context.pages.right_panel_tile_page().get_context_menu_item_for_name(expected_menu_items)
    AssertUtil.assert_simple(found, True)

@step('I verify object is imported as Pivot Table')
def step_impl(context):
    pivot_table = context.pages.right_panel_tile_page().get_pivot_table_menu()
    AssertUtil.assert_simple(pivot_table, True)
