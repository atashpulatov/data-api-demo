from behave import *


@step('I closed Show Data panel')
def step_impl(context):
    context.pages.import_dossier_show_data_page().close_show_data()
