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


@step('I clicked import dossier to duplicate')
def step_impl(context):
    context.pages.import_dossier_page().click_import_visualization_to_duplicate()


@step('I clicked import dossier without waiting for results')
def step_impl(context):
    context.pages.import_dossier_page().click_import_visualization_without_waiting_for_results()


@step('I waited for dossier to load successfully')
def step_impl(context):
    context.pages.import_dossier_page().wait_for_dossier_to_load()


@step('I selected panel stack "{nested_panel_stack_name}" nested in panel stack "{panel_stack_name}"')
def step_impl(context, nested_panel_stack_name, panel_stack_name):
    context.pages.import_dossier_page().select_panel_stack_nested_in_panel_stack(
        nested_panel_stack_name,
        panel_stack_name
    )


@step('I selected panel stack "{panel_stack_name}"')
def step_impl(context, panel_stack_name):
    context.pages.import_dossier_page().select_panel_stack(panel_stack_name)


@step('I selected "{visualization_name}" on Info Window Panel')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().select_info_window_visualization(visualization_name)


@step('I opened Show Data panel for "{visualization_name}" on Info Window')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().open_show_data_panel_on_info_window(visualization_name)


@step('I maximized "{visualization_name}" on Info Window')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().maximize_visualization_on_info_window(visualization_name)


@step('I minimized "{visualization_name}" on Info Window')
def step_impl(context, visualization_name):
    context.pages.import_dossier_page().minimize_visualization_on_info_window(visualization_name)
