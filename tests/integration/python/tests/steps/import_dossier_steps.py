from behave import *


@step('I selected visualization "{visualization_name}"')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().select_visualization_by_name(visualization_name)


@step('I imported visualization "{visualization_name}"')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().import_visualization_by_name(visualization_name)


@step('I opened Show Data panel for "{visualization_name}"')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().open_show_data_panel(visualization_name)


@step('I reset dossier')
def step_impl(context):
    context.pages.import_dossier_page().reset_dossier()


@step('I clicked import dossier')
def step_impl(context):
    context.pages.import_dossier_page().click_import_visualization()


@step('I clicked import dossier without waiting for results')
def step_impl(context):
    context.pages.import_dossier_page().click_import_visualization_without_waiting_for_results()
