from behave import *

from framework.util.assert_util import AssertUtil


@step('MyLibrary Switch is OFF')
def step_impl(context):
    context.pages.import_data_page().ensure_mylibrary_switch_is_off()


@step('I found object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_page().find_object(object_name)


@step('I found and selected object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_page().find_and_select_object(object_name)


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


@step('I verify copying the details to clipboard works correctly')
def step_impl(context):
    compare_result = context.pages.import_data_page().copy_object_details_to_clipboard_and_verify_if_correct()

    AssertUtil.assert_simple(compare_result, True)


@step('I close Import Data popup')
def step_impl(context):
    context.pages.import_data_page().close_import_data_popup()


@step('I clicked Filters button')
def step_impl(context):
    context.pages.import_data_page().click_filters_button()


@step('I clicked Import button and see error "{error_message}"')
def step_impl(context, error_message):
    context.pages.import_data_page().click_import_button_to_import_with_error(error_message)
