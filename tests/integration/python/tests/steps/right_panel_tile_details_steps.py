from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked toggle details button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_toggle_details_button(object_number)


@step('I hovered over toggle details button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().hover_over_toggle_details_button(object_number)


@step('tooltip text for object {object_number} toggle details button is "{expected_tooltip_text}"')
def step_impl(context, object_number, expected_tooltip_text):
    tooltip_text = context.pages.right_panel_tile_details_page().get_toggle_details_tooltip_text(object_number)

    AssertUtil.assert_simple(tooltip_text, expected_tooltip_text)


@step('I clicked "{name_list_type}" list expand button on object {object_number}')
def step_impl(context, name_list_type, object_number):
    context.pages.right_panel_tile_details_page().click_name_list_expand_button(object_number, name_list_type)


@step('I clicked object location expand button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_object_location_expand_button(object_number)


@step('object {object_number} is certified')
def step_impl(context, object_number):
    is_certified = context.pages.right_panel_tile_details_page().is_object_is_certified(object_number)

    AssertUtil.assert_simple(is_certified, True)


@step('Object {object_number} is NOT certified')
def step_impl(context, object_number):
    is_certified = context.pages.right_panel_tile_details_page().check_if_object_is_certified(object_number)

    AssertUtil.assert_simple(is_certified, False)


@step('object {object_number} has "{name_list_type}" with value "{expected_value}"')
def step_impl(context, object_number, name_list_type, expected_value):
    attributes = context.pages.right_panel_tile_details_page().get_object_list_property_value(
        object_number,
        name_list_type
    )

    AssertUtil.assert_strings_only_printable_characters(attributes, expected_value)


@step('object {object_number} has "{name_list_type}" list displayed')
def step_impl(context, object_number, name_list_type):
    name_list_exists = context.pages.right_panel_tile_details_page().name_list_exists_on_object(
        object_number,
        name_list_type
    )

    AssertUtil.assert_simple(name_list_exists, True)


@step('object {object_number} has collapsed "{name_list_type}" list displayed')
def step_impl(context, object_number, name_list_type):
    name_list_exists = context.pages.right_panel_tile_details_page().collapsed_name_list_exists_on_object(
        object_number,
        name_list_type
    )

    AssertUtil.assert_simple(name_list_exists, True)


@step('object {object_number} has id "{expected_object_id}"')
def step_impl(context, object_number, expected_object_id):
    object_id = context.pages.right_panel_tile_details_page().get_object_id(object_number)

    AssertUtil.assert_simple(expected_object_id, object_id)


@step('object {object_number} has owner "{expected_owner_name}"')
def step_impl(context, object_number, expected_owner_name):
    owner_name = context.pages.right_panel_tile_details_page().get_object_owner(object_number)

    AssertUtil.assert_simple(expected_owner_name, owner_name)


@step('Object {object_number} has details panel displayed')
def step_impl(context, object_number):
    is_details_panel_displayed = \
        context.pages.right_panel_tile_details_page().is_details_panel_displayed_on_object(object_number)

    AssertUtil.assert_simple(is_details_panel_displayed, True)


@step('Object {object_number} has NO details panel displayed')
def step_impl(context, object_number):
    is_details_panel_displayed = \
        context.pages.right_panel_tile_details_page().is_details_panel_displayed_on_object(object_number)

    AssertUtil.assert_simple(is_details_panel_displayed, False)


@step('object {object_number} has full location "{expected_object_location}" displayed')
def step_impl(context, object_number, expected_object_location):
    object_location = context.pages.right_panel_tile_details_page().get_object_location(object_number)

    AssertUtil.assert_simple(expected_object_location, object_location)


@step('object {object_number} has collapsed location displayed')
def step_impl(context, object_number):
    collapsed_location_exists = context.pages.right_panel_tile_details_page().collapsed_location_exists_on_object(
        object_number
    )

    AssertUtil.assert_simple(collapsed_location_exists, True)


@step('object {object_number} has totals and subtotals turned ON')
def step_impl(context, object_number):
    result = context.pages.right_panel_tile_details_page().check_if_totals_and_subtotals_are_on(object_number)

    AssertUtil.assert_simple(result, True)


@step('object {object_number} has totals and subtotals for turned OFF')
def step_impl(context, object_number):
    result = context.pages.right_panel_tile_details_page().check_if_totals_and_subtotals_are_on(object_number)

    AssertUtil.assert_simple(result, False)
