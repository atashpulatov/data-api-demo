from behave import *

from framework.util.assert_util import AssertUtil


@step('I "{filter_change}" year filter value on dossier from "{filter_side}" side')
def step_impl(context, filter_change, filter_side):
    context.pages.import_dossier_filter_page().increase_year_filter_value(filter_change, filter_side)


@step('I selected year "{year}" in Year filter')
def step_impl(context, year):
    context.pages.import_dossier_filter_page().select_year_in_year_filter(year)


@step('I verified value for filter "{filter_name}" is "{filter_value}"')
def step_impl(context, filter_name, filter_value):
    result = context.pages.import_dossier_filter_page().get_filter_value(filter_name)

    AssertUtil.assert_simple(result, filter_value)
