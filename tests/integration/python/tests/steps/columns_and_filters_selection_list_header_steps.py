from behave import *

from framework.util.assert_util import AssertUtil


@step('I verified that counter of "{item_type}" shows "{number}" of "{of_number}" selected')
def step_impl(context, item_type, number, of_number):
    expected_result = f'{item_type.upper()} ({number}/{of_number})'

    result = context.pages.columns_and_filters_selection_list_header_page().get_column_title(item_type).upper()

    AssertUtil.assert_simple(result, expected_result)


@step('I changed sort order of "{object_type}" to ascending by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_list_header_page().sort_elements_ascending_by_click(object_type)


@step('I changed sort order of "{object_type}" to descending by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_list_header_page().sort_elements_descending_by_click(object_type)


@step('I changed sort order of "{object_type}" to default by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_list_header_page().sort_elements_default_by_click(object_type)


@step('I pressed tab until sorting "{object_type}" is focused')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_list_header_page().press_tab_until_object_type_focused(object_type)


@step('I changed sort order of "{object_type}" to ascending by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_list_header_page().press_enter_to_sort_element_ascending(object_type)


@step('I changed sort order of "{object_type}" to descending by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_list_header_page().press_enter_to_sort_element_descending(object_type)


@step('I changed sort order of "{object_type}" to default by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_list_header_page().press_enter_to_sort_element_default(object_type)
