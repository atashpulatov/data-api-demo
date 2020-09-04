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


@step('object {object_number} has "{name_list_type}" list displayed')
def step_impl(context, object_number, name_list_type):
    name_list_exists = context.pages.right_panel_tile_details_page().name_list_exists_on_object(
        object_number,
        name_list_type
    )

    AssertUtil.assert_simple(name_list_exists, True)


@step('object {object_number} has id "{expected_object_id}"')
def step_impl(context, object_number, expected_object_id):
    object_id = context.pages.right_panel_tile_details_page().get_object_id(object_number)

    AssertUtil.assert_simple(expected_object_id, object_id)
