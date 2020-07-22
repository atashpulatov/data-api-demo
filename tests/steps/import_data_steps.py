from behave import *


@step('MyLibrary Switch is OFF')
def step_impl(context):
    context.pages.import_data_popup_page().ensure_mylibrary_switch_is_off()


@step('I found and selected object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_popup_page().find_and_select_object(object_name)


@step('I clicked Import button')
def step_impl(context):
    context.pages.import_data_popup_page().click_import_button()
    

@step('I clicked Import button only')
def step_impl(context):
    context.pages.import_data_popup_page().click_import_button_only()


@step('I clicked Import button to open Import Dossier')
def step_impl(context):
    context.pages.import_data_popup_page().click_import_button_to_open_import_dossier()


@step('I clicked Prepare Data button')
def step_impl(context):
    context.pages.import_data_popup_page().click_prepare_data_button()


@step('I added dossier to Library if not yet added')
def step_impl(context):
    context.pages.import_data_popup_page().add_dossier_to_library()


@step('I clicked Import button and see error "{error_message}"')
def step_impl(context, error_message):
    context.pages.import_data_popup_page().click_import_button_to_import_with_error(error_message)
