from behave import *


@step('I clicked attribute "{attribute_name}"')
def step_impl(context, attribute_name):
    context.pages.columns_and_filters_selection_page().click_attribute(attribute_name)


@step('I clicked metric "{metric_name}"')
def step_impl(context, metric_name):
    context.pages.columns_and_filters_selection_page().click_metric(metric_name)


@step('I set Display attribute form names to "{form_visualization_type}"')
def step_impl(context, form_visualization_type):
    context.pages.columns_and_filters_selection_page().click_display_attributes_names_type(form_visualization_type)


@step('I unselected all attributes')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().unselect_all_attributes()


@step('I selected all metrics')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().select_all_metrics()


@step('I unselected all metrics')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().unselect_all_metrics()


@step('I clicked attributes and forms {attributes_and_forms_json}')
def step_impl(context, attributes_and_forms_json):
    context.pages.columns_and_filters_selection_page().click_attributes_and_forms(attributes_and_forms_json)


@when('I clicked Import button in Columns and Filters Selection')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button()
