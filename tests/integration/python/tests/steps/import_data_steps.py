from behave import *

from framework.util.assert_util import AssertUtil


@step('I ensured that MyLibrary Switch is OFF')
def step_impl(context):
    context.pages.import_data_page().ensure_mylibrary_switch_is_off()


@step('I switched on MyLibrary')
def step_impl(context):
    context.pages.import_data_page().ensure_mylibrary_switch_is_on()


@step('I switched off MyLibrary')
def step_impl(context):
    context.pages.import_data_page().ensure_mylibrary_switch_is_off()


@step('I found object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_page().find_object(object_name)


@step('I found and selected object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_page().find_and_select_object(object_name)


@step('I found object by ID "{object_id}" and selected "{object_name}"')
def step_impl(context, object_id, object_name):
    context.pages.import_data_page().find_and_select_object_by_id(object_name, object_id)


@step('I clicked Import button')
def step_impl(context):
    context.pages.import_data_page().click_import_button()


@step('I clicked Import button without checking results')
def step_impl(context):
    context.pages.import_data_page().click_import_button_without_checking_results()


@step('I clicked Import button to open Import Dossier')
def step_impl(context):
    context.pages.import_data_page().click_import_button_to_open_import_dossier()


@step('I clicked Prepare Data button')
def step_impl(context):
    context.pages.import_data_page().click_prepare_data_button()


@step('I added dossier to Library if not yet added')
def step_impl(context):
    context.pages.import_data_page().add_dossier_to_library()


@step('I displayed details for object number {object_number}')
def step_impl(context, object_number):
    context.pages.import_data_page().show_object_details(object_number)


@step('I verified that copying the details to clipboard works correctly')
def step_impl(context):
    compare_result = context.pages.import_data_page().copy_object_details_to_clipboard_and_verify_if_correct()

    AssertUtil.assert_simple(compare_result, True)


@step('I closed Import Data popup')
def step_impl(context):
    context.pages.import_data_page().close_import_data_popup()


@step('I clicked Filters button')
def step_impl(context):
    context.pages.import_data_page().click_filters_button()


@step('I clicked Import button and saw error "{error_message}"')
def step_impl(context, error_message):
    context.pages.import_data_page().click_import_button_to_import_with_error(error_message)


@step('I hovered over the first object in the list')
def step_impl(context):
    context.pages.import_data_page().hover_over_first_object_in_list()


@step('I selected the first object from the list')
def step_impl(context):
    context.pages.import_data_page().select_first_object_from_list()


@step('I verified that the background color of the first object is "{color}"')
def step_impl(context, color):
    found_color = context.pages.import_data_page().find_the_color_of_first_object_in_list()
    AssertUtil.assert_simple(found_color, color)


@step('I verified that Import button is disabled')
def step_impl(context):
    context.pages.import_data_page().verify_if_import_button_is_disabled()


@step('I cleared search box')
def step_impl(context):
    context.pages.import_data_page().clear_search_box()


@step('I hover over Import button')
def step_impl(context):
    context.pages.import_data_page().hover_over_import_button()


@step('I verified that tooltip for Import button shows message "{expected_tooltip_text}"')
def step_impl(context, expected_tooltip_text):
    tooltip_text = context.pages.import_data_page().get_tooltip_message_for_button()

    AssertUtil.assert_simple(tooltip_text, expected_tooltip_text)
