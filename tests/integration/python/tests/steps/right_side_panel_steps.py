from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked Import Data button')
def step_impl(context):
    context.pages.right_panel_page().click_import_data_button_element()


@step('I clicked Add Data button')
def step_impl(context):
    context.pages.right_panel_page().click_add_data_button_element()


@step('I logged out')
def step_impl(context):
    context.pages.right_panel_page().logout()


@step('I refreshed all objects')
def step_impl(context):
    context.pages.right_panel_page().refresh_all()


@step('I removed all objects')
def step_impl(context):
    context.pages.right_panel_page().remove_all()


@step('I verified that the right panel is empty')
def step_impl(context):
    is_right_panel_empty = context.pages.right_panel_page().check_if_right_panel_is_empty()

    AssertUtil.assert_simple(is_right_panel_empty, True)


@step('I clicked clear data')
def step_impl(context):
    context.pages.right_panel_page().clear_data()


@step('I clicked view data')
def step_impl(context):
    context.pages.right_panel_page().view_data()


@step('I hovered over Log Out in Dots Menu')
def step_impl(context):
    context.pages.right_panel_page().hover_over_logout()


@step('I verified that the background color of Log Out is "{color}"')
def step_impl(context, color):
    found_color = context.pages.right_panel_page().get_background_color_of_logout()

    AssertUtil.assert_simple(found_color, color)


@step('I verified that right panel has scrollbar')
def step_impl(context):
    is_scrollbar_visible = context.pages.right_panel_page().is_scrollbar_visible()

    AssertUtil.assert_simple(is_scrollbar_visible, True)


@step('I refreshed selected objects')
def step_impl(context):
    context.pages.right_panel_page().click_refresh_selected_button()


@step('I removed selected objects')
def step_impl(context):
    context.pages.right_panel_page().click_remove_selected_button()


@step('I waited for Clear Data overlay to have title "{overlay_title}"')
def step_impl(context, overlay_title):
    context.pages.right_panel_page().wait_for_clear_data_overlay_to_finish_successfully_with_title(overlay_title)


@step('I verified that the Clear Data overlay displayed message "{overlay_message}"')
def step_impl(context, overlay_message):
    displayed_message = context.pages.right_panel_page().get_clear_data_overlay_message()

    AssertUtil.assert_simple(displayed_message, overlay_message)

@step('I open Settings in Dots Menu')
def step_impl(context):
    context.pages.right_panel_page().open_setting()

@step('I clicked "{menu_option}" section on Settings menu')
def step_impl(context, menu_option):
    context.pages.right_panel_page().open_setting_menu_option(menu_option)

@step('I toggle the Reuse Prompt Answers setting')
def step_impl(context):
    context.pages.right_panel_page().toggle_reuse_prompt_answer()

@step('I click back button in Settings')
def step_impl(context):
    context.pages.right_panel_page().click_back_button()

@step('I check the Reuse Prompt Answers setting is OFF')
def step_impl(context):
    is_reuse_prompt_answer_enabled = context.pages.right_panel_page().get_reuse_prompt_answer_status()
    AssertUtil.assert_simple(is_reuse_prompt_answer_enabled, False)

@step('I check the Reuse Prompt Answers setting is ON')
def step_impl(context):
    is_reuse_prompt_answer_enabled = context.pages.right_panel_page().get_reuse_prompt_answer_status()
    AssertUtil.assert_simple(is_reuse_prompt_answer_enabled, True)
    AssertUtil.assert_simple(is_reuse_prompt_answer_enabled, True)

@step('I clicked Overview settings menu option')
def step_impl(context):
    context.pages.right_panel_page().click_imported_data_overview_settings_menu()

@step('I toggle the "{option}" parent setting to "{value}"')
def step_impl(context, option, value):
    context.pages.right_panel_page().toggle_parent_setting(option, value)

@step('I verified "{option}" parent setting is OFF')
def step_impl(context, option):
    is_option_checked = context.pages.right_panel_page().is_parent_toggle_option_checked(option)
    AssertUtil.assert_simple(is_option_checked, False)
 
@step('I verified "{option}" parent setting is ON')
def step_impl(context, option):
    is_option_checked = context.pages.right_panel_page().is_parent_toggle_option_checked(option)
    AssertUtil.assert_simple(is_option_checked, True)
 
@step('I toggle the "{option}" child setting to "{value}"')
def step_impl(context, option, value):
    context.pages.right_panel_page().toggle_child_setting(option, value)
 
@step('I verified "{option}" child setting is OFF')
def step_impl(context, option):
    is_option_checked = context.pages.right_panel_page().is_child_toggle_option_checked(option)
    AssertUtil.assert_simple(is_option_checked, False)
 
@step('I verified "{option}" child setting is ON')
def step_impl(context, option):
    is_option_checked = context.pages.right_panel_page().is_child_toggle_option_checked(option)
    AssertUtil.assert_simple(is_option_checked, True)
 
@step('I verified draggable "{option}" child setting is OFF')
def step_impl(context, option):
    is_option_checked = context.pages.right_panel_page().is_draggable_child_toggle_option_checked(option)
    AssertUtil.assert_simple(is_option_checked, False)
 
@step('I verified draggable "{option}" child setting is ON')
def step_impl(context, option):
    is_option_checked = context.pages.right_panel_page().is_draggable_child_toggle_option_checked(option)
    AssertUtil.assert_simple(is_option_checked, True)

@step('I verified that number of objects in side panel is {expected_number_of_object_tiles}')
def step_impl(context, expected_number_of_object_tiles):
    result = context.pages.right_panel_page().get_number_of_object_tiles()

    AssertUtil.assert_simple(result, int(expected_number_of_object_tiles))
    
@step('I clicked "{context_menu_option}" using context menu in object {object_number}')
def step_impl(context, context_menu_option, object_number):
    context.pages.right_panel_page().click_context_menu_item(context_menu_option, int(object_number))

@step('I selected "{display_option}" display option')
def step_impl(context, display_option):
    context.pages.right_panel_page().click_display_option(display_option)

@step('I verified Settings is NOT visible')
def step_impl(context):
    result = context.pages.right_panel_page().is_settings_visible()
    AssertUtil.assert_simple(result, False)