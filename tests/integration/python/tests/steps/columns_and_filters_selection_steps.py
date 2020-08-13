from behave import *

from framework.util.assert_util import AssertUtil


@step('I ensure that Columns & Filters Selection is visible')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().ensure_columns_and_filters_selection_is_visible()


@step('I clicked attribute "{attribute_name}"')
def step_impl(context, attribute_name):
    context.pages.columns_and_filters_selection_page().click_attribute(attribute_name)


@step('I clicked metric "{metric_name}"')
def step_impl(context, metric_name):
    context.pages.columns_and_filters_selection_page().click_metric(metric_name)


@step('I set Display attribute form names to "{form_visualization_type}"')
def step_impl(context, form_visualization_type):
    context.pages.columns_and_filters_selection_page().click_display_attributes_names_type(form_visualization_type)


@step('I selected all attributes')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().select_all_attributes()


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


@step('attribute number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_attribute_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('metric number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_metric_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('filter number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_filter_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I changed sort order of "{object_type}" to ascending by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().sort_elements_ascending_by_click(object_type)


@step('I changed sort order of "{object_type}" to descending by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().sort_elements_descending_by_click(object_type)


@step('I changed sort order of "{object_type}" to default by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().sort_elements_default_by_click(object_type)


@step('I searched for element called "{element_name}"')
def step_impl(context, element_name):
    context.pages.columns_and_filters_selection_page().search_for_element(element_name)


@step('I cleared the search for element')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().clear_search_element()


@step('I cleared the search for element with backspace')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().clear_element_search_with_backspace()


@step('I pressed tab until sorting "{object_type}" is focused')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_tab_until_object_type_focused(object_type)


@step('I changed sort order of "{object_type}" to ascending by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_enter_to_sort_element_ascending(object_type)


@step('I changed sort order of "{object_type}" to descending by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_enter_to_sort_element_descending(object_type)


@step('I changed sort order of "{object_type}" to default by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_enter_to_sort_element_default(object_type)


@step('I selected "{object_type}" element number {object_number}')
def step_impl(context, object_type, object_number):
    context.pages.columns_and_filters_selection_page().select_element_by_number(object_type, object_number)


@step('I deselected "{object_type}" element number {object_number}')
def step_impl(context, object_type, object_number):
    context.pages.columns_and_filters_selection_page().select_element_by_number(object_type, object_number)


@step('I expanded attribute forms of attribute number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_page().expand_attribute_form(object_number)


@step('I collapsed attribute forms of attribute number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_page().collapse_attribute_form(object_number)


@step('attribute form number {attribute_form_number} of attribute number {attribute_number} '
      'should be called "{expected_name}"')
def step_impl(context, attribute_form_number, attribute_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_attribute_form_name(
        attribute_form_number,
        attribute_number
    )
    AssertUtil.assert_simple(result, expected_name)


@step('I scrolled into "{object_type}" element number {object_number}')
def step_impl(context, object_type, object_number):
    context.pages.columns_and_filters_selection_page().scroll_into_object_by_number(object_number, object_type)


@when('I clicked Import button in Columns and Filters Selection')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button()


@when('I clicked Import button in Columns and Filters Selection to duplicate object')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button_to_duplicate()
