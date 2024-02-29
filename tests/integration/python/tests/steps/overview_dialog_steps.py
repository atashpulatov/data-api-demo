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

