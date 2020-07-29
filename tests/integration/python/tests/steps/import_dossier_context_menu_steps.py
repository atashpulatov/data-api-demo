from behave import *


@step('I selected "{totals_to_select}" in Show Totals for "{attribute_name}" attribute')
def step_impl(context, totals_to_select, attribute_name):
    context.pages.import_dossier_context_menu_page().select_show_totals_for_attribute(totals_to_select, attribute_name)


@step('I selected sort "{sort_order}" for "{metric_name}" metric')
def step_impl(context, sort_order, metric_name):
    context.pages.import_dossier_context_menu_page().select_sort_order_for_metric(sort_order, metric_name)


@step('I selected Drill by "{drill_by}" for "{attribute_name}" attribute')
def step_impl(context, drill_by, attribute_name):
    context.pages.import_dossier_context_menu_page().select_drill_by_for_attribute(drill_by, attribute_name)
