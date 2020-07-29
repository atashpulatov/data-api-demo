from behave import *


@step('I selected dossier page or chapter {option_number}')
def step_impl(context, option_number):
    context.pages.import_dossier_table_of_contents_page().select_table_of_content_option(option_number)
