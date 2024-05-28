from behave import *
from framework.util.assert_util import AssertUtil

@step('I verified Overview window is opened')
def step_impl(context):
    is_overview_window_opened = context.pages.overview_dialog_page().check_if_overview_dialog_is_opened()
    AssertUtil.assert_simple(is_overview_window_opened, True)

@step('I verified "{button_text}" button in Overview window is visible')
def step_impl(context, button_text):
    is_action_button_visible = context.pages.overview_dialog_page().is_action_button_visible(button_text)
    AssertUtil.assert_simple(is_action_button_visible, True)

@step('I verified "{button_text}" button in Overview window is enabled')
def step_impl(context, button_text):
    is_action_button_enabled = context.pages.overview_dialog_page().is_action_button_enabled(button_text)
    AssertUtil.assert_simple(is_action_button_enabled, True)

@step('I verified "{button_text}" button in Overview window is disabled')
def step_impl(context, button_text):
    is_action_button_enabled = context.pages.overview_dialog_page().is_action_button_enabled(button_text)
    AssertUtil.assert_simple(is_action_button_enabled, False)

@step('I clicked select all checkbox in Overview window')
def step_impl(context):
    context.pages.overview_dialog_page().click_select_all_checkbox()

@step('I clicked "{action}" button in Overview window')
def step_impl(context, action):
    context.pages.overview_dialog_page().click_action_button(action)

@step('I waited for all objects to be refreshed successfully')
def step_impl(context):
    context.pages.overview_dialog_page().wait_for_all_objects_to_refresh_successfully()

@step('I selected object "{row_index}" using object checkbox in Overview window')
def step_impl(context, row_index):
    context.pages.overview_dialog_page().click_row_checkbox(row_index)

@step('I clicked OK button in Range Taken popup in Overview window')
def step_impl(context):
    context.pages.overview_dialog_page().click_ok_in_range_taken_popup()

@step('I found object "{object_name}" in Overview window')
def step_impl(context, object_name):
    context.pages.overview_dialog_page().search_object(object_name)

@step('I cleared search box in Overview window')
def step_imp(context):
    context.pages.overview_dialog_page().clear_search_input()

@step('I verified that object "{object_name}" is NOT visible')
def step_impl(context, object_name):
    is_object_row_visible = context.pages.overview_dialog_page().is_object_row_visible(object_name)
    AssertUtil.assert_simple(is_object_row_visible, False)

@step('I verified that object "{object_name}" is visible')
def step_impl(context, object_name):
    is_object_row_visible = context.pages.overview_dialog_page().is_object_row_visible(object_name)
    AssertUtil.assert_simple(is_object_row_visible, True)

@step('I verified that New Sheet is selected in Duplicate popup')
def step_impl(context):
    is_new_sheet_selected = context.pages.overview_dialog_page().is_new_sheet_selected()
    AssertUtil.assert_simple(is_new_sheet_selected, True)

@step('I clicked Import button in Duplicate popup on overview')
def step_impl(context):
    context.pages.overview_dialog_page().click_import_button_in_duplicate_popup()

@step('I verified that Delete confirmation popup is visible')
def step_impl(context):
    is_delete_popup_visible = context.pages.overview_dialog_page().is_delete_popup_visible()
    AssertUtil.assert_simple(is_delete_popup_visible, True)

@step('I clicked Delete button in confirmation popup')
def step_impl(context):
    context.pages.overview_dialog_page().click_delete_in_delete_popup()

@step('I verified that Filter panel is visible in Overview window')
def step_impl(context):
    is_filter_panel_visible = context.pages.overview_dialog_page().is_filter_panel_visible()
    AssertUtil.assert_simple(is_filter_panel_visible, True)

@step('I clicked "{filter_option}" filter in Filter panel')
def step_impl(context, filter_option):
    context.pages.overview_dialog_page().click_filter_option_in_filter_panel(filter_option)

@step('I selected "{filter_checkbox}" filter option')
def step_impl(context, filter_checkbox):
    context.pages.overview_dialog_page().click_filter_checkbox_in_filter_panel(filter_checkbox)

@step('I clicked Apply button in Filter panel')
def step_impl(context):
    context.pages.overview_dialog_page().click_apply_in_filter_panel()

@step('I clicked "{filter_details_button}" in filter details')
def step_impl(context, filter_details_button):
    context.pages.overview_dialog_page().click_filter_details_button(filter_details_button)

@step('I verified that filter details are visible in Overview window')
def step_impl(context):
    is_filter_details_visible = context.pages.overview_dialog_page().is_filter_details_visible()
    AssertUtil.assert_simple(is_filter_details_visible, True)

@step('I verified that filter details are NOT visible in Overview window')
def step_impl(context):
    is_filter_details_not_visible = context.pages.overview_dialog_page().is_not_filter_details_visible()
    AssertUtil.assert_simple(is_filter_details_not_visible, True)

@step('I verified that Filter panel is NOT visible in Overview window')
def step_impl(context):
    is_filter_panel_visible = context.pages.overview_dialog_page().is_filter_panel_visible()
    AssertUtil.assert_simple(is_filter_panel_visible, False)

@step('I waited for all objects to be removed successfully')
def step_impl(context):
    are_all_objects_are_removed = context.pages.overview_dialog_page().are_all_objects_are_removed()
    AssertUtil.assert_simple(are_all_objects_are_removed, True)

@step('I verified that number of objects in Overview window is {expected_number_of_objects}')
def step_impl(context, expected_number_of_objects):
    number_of_objects = context.pages.overview_dialog_page().get_number_of_objects_in_grid()
    AssertUtil.assert_simple(number_of_objects, int(expected_number_of_objects))
