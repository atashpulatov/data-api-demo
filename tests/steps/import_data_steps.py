from behave import *

from util.assert_util import AssertUtil

@step('MyLibrary Switch is OFF')
def step_impl(context):
    context.pages.import_data_popup_page().ensure_mylibrary_switch_is_off()


@step('I found object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_popup_page().find_object(object_name)


@step('I found and selected object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_popup_page().find_and_select_object(object_name)


@step('I clicked Import button')
def step_impl(context):
    context.pages.import_data_popup_page().click_import_button()


@step('I clicked Import button to open Import Dossier')
def step_impl(context):
    context.pages.import_data_popup_page().click_import_button_to_open_import_dossier()


@step('I clicked Prepare Data button')
def step_impl(context):
    context.pages.import_data_popup_page().click_prepare_data_button()


@step('I added dossier to Library if not yet added')
def step_impl(context):
    context.pages.import_data_popup_page().add_dossier_to_library()


@step('I expanded object details with index "{object_index}"')
def step_impl(context, object_index):
    context.pages.import_data_popup_page().expand_object(int(object_index))


@step('I verify copying the details works correctly')
def step_impl(context):
    AssertUtil.assert_simple(context.pages.import_data_popup_page().copy_and_compare_all_details(), True)
