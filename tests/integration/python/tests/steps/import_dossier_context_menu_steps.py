from behave import *


@step('I selected "{totals_to_select}" in Show Totals for "{attribute_name}" attribute '
      'for visualization "{visualization_name}"')
def step_impl(context, totals_to_select, attribute_name, visualization_name):
    context.pages.import_dossier_context_menu_page().select_show_totals_for_attribute(
        totals_to_select,
        attribute_name,
        visualization_name
    )


@step('I selected sort "{sort_order}" for "{metric_name}" metric for visualization "{visualization_name}"')
def step_impl(context, sort_order, metric_name, visualization_name):
    context.pages.import_dossier_context_menu_page().select_sort_order_for_metric(
        sort_order,
        metric_name,
        visualization_name
    )


@step('I selected Drill by "{drill_by}" for "{attribute_name}" attribute for visualization "{visualization_name}"')
def step_impl(context, drill_by, attribute_name, visualization_name):
    context.pages.import_dossier_context_menu_page().select_drill_by_for_attribute(
        drill_by,
        attribute_name,
        visualization_name
    )


@step('I selected "{replace_with}" in Replace With for "{attribute_name}" attribute '
      'for visualization "{visualization_name}"')
def step_impl(context, replace_with, attribute_name, visualization_name):
    context.pages.import_dossier_context_menu_page().select_replace_with_for_attribute(
        replace_with,
        attribute_name,
        visualization_name
    )


@step('I selected Exclude for "{exclude}" element in "{attribute_name}" attribute '
      'for visualization "{visualization_name}"')
def step_impl(context, exclude, attribute_name, visualization_name):
    context.pages.import_dossier_context_menu_page().select_exclude_for_attribute_element(
        exclude,
        attribute_name,
        visualization_name
    )


@step('I clicked "{selected_element}" element in "{attribute_name}" attribute '
      'for visualization "{visualization_name}"')
def step_impl(context, selected_element, attribute_name, visualization_name):
    context.pages.import_dossier_context_menu_page().select_attribute_element(
        selected_element,
        attribute_name,
        visualization_name
    )
    
