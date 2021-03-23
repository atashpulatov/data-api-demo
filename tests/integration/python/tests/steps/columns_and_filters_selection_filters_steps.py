from behave import *

from framework.util.assert_util import AssertUtil


@step('I selected filter "{filter_name}" with all elements')
def step_impl(context, filter_name):
    context.pages.columns_and_filters_selection_filters_page().select_all_filter_elements(filter_name)


@step('I verified that filter number {object_number} is called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_filters_page().get_filter_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I selected filter element number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_filters_page().select_filter_by_number(object_number)


@step('I deselected filter element number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_filters_page().select_filter_by_number(object_number)


@step('I scrolled into filter element number {object_number} and selected it')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_filters_page().scroll_into_and_select_filter_by_number(object_number)


@step('I selected filters {filters_and_elements_json}')
def step_impl(context, filters_and_elements_json):
    context.pages.columns_and_filters_selection_filters_page().select_filter_elements(filters_and_elements_json)


@step('I hovered over first filter')
def step_impl(context):
    context.pages.columns_and_filters_selection_filters_page().hover_over_first_filter()


@step('I selected the first filter')
def step_impl(context):
    context.pages.columns_and_filters_selection_filters_page().select_first_filter()


@step('I verified that the background color of the first filter is "{color}"')
def step_impl(context, color):
    found_color = context.pages.columns_and_filters_selection_filters_page().get_background_color_of_first_filter()

    AssertUtil.assert_simple(found_color, color)
