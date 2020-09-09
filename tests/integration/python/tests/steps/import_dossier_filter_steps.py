from behave import *


@step('I "{filter_change}" year filter value on dossier from "{filter_side}" side')
def step_impl(context, filter_change, filter_side):
    context.pages.import_dossier_filter_page().increase_year_filter_value(filter_change, filter_side)

