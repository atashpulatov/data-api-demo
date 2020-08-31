from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked toggle details button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_toggle_details_button(object_number)


@step('I hovered over toggle details button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().hover_over_toggle_details_button(object_number)


@step('Tooltip text for object {object_number} toggle details button is "{expected_tooltip_text}"')
def step_impl(context, object_number, expected_tooltip_text):
    tooltip_text = context.pages.right_panel_tile_details_page().get_toggle_details_tooltip_text(object_number)

    AssertUtil.assert_simple(tooltip_text, expected_tooltip_text)


@step('I clicked "{name_list_type}" list expand button on object {object_number}')
def step_impl(context, object_number, name_list_type):
    context.pages.right_panel_tile_details_page().click_name_list_expand_button(object_number, name_list_type)


@step('I clicked object location expand button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_object_location_expand_button(object_number)


@step('Object {object_number} is certified')
def step_impl(context, object_number):
    is_certified = context.pages.right_panel_tile_details_page().check_if_object_is_certified(object_number)

    AssertUtil.assert_simple(is_certified, True)


@step('Object {object_number} is NOT certified')
def step_impl(context, object_number):
    is_certified = context.pages.right_panel_tile_details_page().check_if_object_is_certified(object_number)

    AssertUtil.assert_simple(is_certified, False)


@step('Object {object_number} has "{name_list_type}" with value "{expected_value}"')
def step_impl(context, object_number, name_list_type, expected_value):
    attributes = context.pages.right_panel_tile_details_page().get_object_list_property_value(
      object_number, name_list_type
    )

    AssertUtil.assert_strings_only_printable_characters(attributes, expected_value)


@step('Object {object_number} has "{name_list_type}" list displayed')
def step_impl(context, object_number, name_list_type):
    context.pages.right_panel_tile_details_page().check_if_name_list_exists_on_object(
        object_number, name_list_type)


@step('Object {object_number} has id "{object_id}"')
def step_impl(context, object_number, object_id):
    context.pages.right_panel_tile_details_page().check_if_object_id_is_correct(
        object_number, object_id)


@step('Object {object_number} has owner {owner}')
def step_impl(context, object_number, owner):
    context.pages.right_panel_tile_details_page().check_if_object_owner_is_correct(
        object_number, owner)


@step('totals and subtotals for object {object_number} are turned ON')
def step_impl(context, object_number):
    result = context.pages.right_panel_tile_details_page().check_if_totals_and_subtotals_are_on(object_number)

    AssertUtil.assert_simple(result, True)


@step('totals and subtotals for object {object_number} are turned OFF')
def step_impl(context, object_number):
    result = context.pages.right_panel_tile_details_page().check_if_totals_and_subtotals_are_on(object_number)

    AssertUtil.assert_simple(result, False)


@step('attributes list for object {object_number} contains attribute "{attribute_name}"')
def step_impl(context, object_number, attribute_name):
    result = context.pages.right_panel_tile_details_page().check_if_attributes_list_contains_attribute(
        object_number, attribute_name)

    AssertUtil.assert_simple(result, True)

@step('attributes list for object {object_number} does NOT contain attribute "{attribute_name}"')
def step_impl(context, object_number, attribute_name):
    result = context.pages.right_panel_tile_details_page().check_if_attributes_list_contains_attribute(
        object_number, attribute_name)

    AssertUtil.assert_simple(result, False)


@step('metrics list for object {object_number} contains metric "{metric_name}"')
def step_impl(context, object_number, metric_name):
    result = context.pages.right_panel_tile_details_page().check_if_metrics_list_contains_metric(
        object_number, metric_name)

    AssertUtil.assert_simple(result, True)

@step('metrics list for object {object_number} does NOT contain metric "{metric_name}"')
def step_impl(context, object_number, metric_name):
    result = context.pages.right_panel_tile_details_page().check_if_metrics_list_contains_metric(
        object_number, metric_name)

    AssertUtil.assert_simple(result, False)
