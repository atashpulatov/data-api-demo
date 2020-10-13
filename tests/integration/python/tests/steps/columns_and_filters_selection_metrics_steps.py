from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked metric "{metric_name}"')
def step_impl(context, metric_name):
    context.pages.columns_and_filters_selection_metrics_page().click_metric(metric_name)


@step('I selected all metrics')
def step_impl(context):
    context.pages.columns_and_filters_selection_metrics_page().select_all_metrics()


@step('I unselected all metrics')
def step_impl(context):
    context.pages.columns_and_filters_selection_metrics_page().unselect_all_metrics()


@step('metric number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_metrics_page().get_metric_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I selected metric element number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_metrics_page().select_metric_by_number(object_number)


@step('I deselected metric element number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_metrics_page().select_metric_by_number(object_number)


@step('I scrolled into metric element number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_metrics_page().scroll_into_metric_by_number(object_number)
