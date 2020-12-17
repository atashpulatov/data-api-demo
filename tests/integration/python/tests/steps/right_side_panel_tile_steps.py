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


@step('I hovered over Edit button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().hover_edit(object_number)


@step('I clicked Duplicate on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_duplicate(object_number)


@step('I clicked Refresh on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().click_refresh(object_number)


@step('I hovered over Refresh button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_page().hover_refresh(object_number)


@step('I verified that tooltip "{expected_tooltip_text}" was displayed on object {object_number}')
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


@step('object number {object_number} should be called "{expected_name}"')
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


@step('I waited for all progress notifications to disappear')
def step_impl(context):
    context.pages.right_panel_tile_page().wait_for_progress_notifications_to_disappear()


@step('object {object_number} icon bar is visible')
def step_impl(context, object_number):
    is_icon_bar_visible = context.pages.right_panel_tile_page().is_icon_bar_visible(object_number)

    AssertUtil.assert_simple(is_icon_bar_visible, True)
