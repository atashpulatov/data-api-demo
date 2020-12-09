from behave import *
from framework.util.assert_util import AssertUtil
from framework.util.exception.MstrException import MstrException


@step('I verified that Columns & Filters Selection is visible')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().ensure_columns_and_filters_selection_is_visible()


@step('I verified popup title is "{title}"')
def step_impl(context, title):
    context.pages.columns_and_filters_selection_page().ensure_popup_title_is_correct(title)


@step('I searched for element called "{element_name}"')
def step_impl(context, element_name):
    context.pages.columns_and_filters_selection_page().search_for_element(element_name)


@step('I cleared the search for element')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().clear_search_element()


@step('I cleared the search for element with backspace')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().clear_element_search_with_backspace()


@step('I clicked Import button in Columns and Filters Selection')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button()


@step('I clicked Import button in Columns and Filters Selection without success check')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button_without_success_check()


@step('I clicked Import button in Columns and Filters Selection to duplicate object')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button_to_duplicate()


@step('I clicked Back button')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_back_button()


@step('I clicked Cancel button')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_cancel_button()


@step('I closed popup window')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().close_popup_window()


@step('I clicked Include Subtotals and Totals switch')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_include_totals_and_subtotals()


@step('I clicked Data Preview button')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_data_preview()


@step('I clicked Close Preview button')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_close_preview()


@step('I verified "{button_name}" button is "{expected_state}"')
def step_impl(context, button_name, expected_state):
    # todo: move lines 78 - 97 to different file, which is shared beetween all platforms
    AVAILABLE_STATES_DICT = {
        'enabled': True,
        'disabled': False,
    }
    AVAILABLE_STATES = AVAILABLE_STATES_DICT.keys()

    if expected_state not in AVAILABLE_STATES:
        raise MstrException(
          f'Specified state not allowed: [{expected_state}], available states: {AVAILABLE_STATES}.')

    AVAILABLE_BUTTON_NAMES = [
        'Import',
        'Data Preview',
        'Cancel',
    ]

    if button_name not in AVAILABLE_BUTTON_NAMES:
        raise MstrException(
          f'Specified button name not allowed: [{button_name}], available buttons: {AVAILABLE_BUTTON_NAMES}.')

    button_enabled = context.pages.columns_and_filters_selection_page().is_button_enabled(button_name)

    AssertUtil.assert_simple(button_enabled, AVAILABLE_STATES_DICT[expected_state])
