from behave import *


@step('I imported visualization having index {visualization_number}')
def step_impl(context, visualization_number):
    context.pages.import_dossier_page().import_visualization(visualization_number)
