from behave import *


@step('I imported visualization called "{visualization_name}"')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().import_visualization_by_name(visualization_name)
