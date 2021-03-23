from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked attribute "{attribute_name}"')
def step_impl(context, attribute_name):
    context.pages.columns_and_filters_selection_attributes_page().click_attribute(attribute_name)


@step('I clicked attribute "{attribute_name}" for dataset')
def step_impl(context, attribute_name):
    context.pages.columns_and_filters_selection_attributes_page().click_attribute_for_dataset(attribute_name)


@step('I selected all attributes')
def step_impl(context):
    context.pages.columns_and_filters_selection_attributes_page().select_all_attributes()


@step('I unselected all attributes')
def step_impl(context):
    context.pages.columns_and_filters_selection_attributes_page().unselect_all_attributes()


@step('I ensured attribute is selected and I clicked forms {attributes_and_forms_json}')
def step_impl(context, attributes_and_forms_json):
    context.pages.columns_and_filters_selection_attributes_page().ensure_attribute_is_selected_and_click_forms(
        attributes_and_forms_json
    )


@step('I verified that attribute number {object_number} is called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_attributes_page().get_attribute_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I selected attribute element number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_attributes_page().select_attribute_by_number(object_number)


@step('I deselected attribute element number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_attributes_page().select_attribute_by_number(object_number)


@step('I expanded attribute forms of attribute number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_attributes_page().expand_attribute_form(object_number)


@step('I collapsed attribute forms of attribute number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_attributes_page().collapse_attribute_form(object_number)


@step('I verified that attribute form number {attribute_form_number} of attribute number {attribute_number} '
      'is called "{expected_name}"')
def step_impl(context, attribute_form_number, attribute_number, expected_name):
    result = context.pages.columns_and_filters_selection_attributes_page().get_attribute_form_name(
        attribute_form_number,
        attribute_number
    )
    AssertUtil.assert_simple(result, expected_name)


@step('I scrolled into attribute element number {object_number} and selected it')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_attributes_page().scroll_into_and_select_attribute_by_number(
        object_number
    )
