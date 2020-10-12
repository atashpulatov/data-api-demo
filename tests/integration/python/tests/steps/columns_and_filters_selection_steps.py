from behave import *


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

@step('I verified that tooltip for Import button shows message "{message}"')
def step_impl(context, message):
    context.pages.columns_and_filters_selection_page().verify_tooltip_message_import_button(message)
