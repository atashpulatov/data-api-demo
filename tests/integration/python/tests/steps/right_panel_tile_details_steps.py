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


@step('I clicked prompts list expand button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_name_list_expand_button(object_number, 0)


@step('I clicked filters list expand button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_name_list_expand_button(object_number, 1)


@step('I clicked attributes list expand button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_name_list_expand_button(object_number, 2)


@step('I clicked metrics list expand button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_name_list_expand_button(object_number, 3)


@step('I clicked object location expand button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_object_location_expand_button(object_number)


@step('Object {object_number} is certified')
def step_impl(context, object_number):
    is_certified = context.pages.right_panel_tile_details_page().check_if_object_is_certified(object_number)

    AssertUtil.assert_simple(is_certified, True)


@step('Object {object_number} has prompts list displayed')
def step_impl(context, object_number):
    is_name_list_displayed = context.pages.right_panel_tile_details_page().check_if_name_list_exists_on_object(
        object_number, 0)

    AssertUtil.assert_simple(is_name_list_displayed, True)


@step('Object {object_number} has filters list displayed')
def step_impl(context, object_number):
    is_name_list_displayed = context.pages.right_panel_tile_details_page().check_if_name_list_exists_on_object(
        object_number, 1)

    AssertUtil.assert_simple(is_name_list_displayed, True)


@step('Object {object_number} has attributes list displayed')
def step_impl(context, object_number):
    is_name_list_displayed = context.pages.right_panel_tile_details_page().check_if_name_list_exists_on_object(
        object_number, 2)

    AssertUtil.assert_simple(is_name_list_displayed, True)


@step('Object {object_number} has metrics list displayed')
def step_impl(context, object_number):
    is_name_list_displayed = context.pages.right_panel_tile_details_page().check_if_name_list_exists_on_object(
        object_number, 3)

    AssertUtil.assert_simple(is_name_list_displayed, True)


@step('Object {object_number} has id "{object_id}"')
def step_impl(context, object_number, object_id):
    context.pages.right_panel_tile_details_page().check_if_object_id_is_correct(
        object_number, object_id)

@step('Object {object_number} has owner {owner}')
def step_impl(context, object_number, owner):
    context.pages.right_panel_tile_details_page().check_if_object_owner_is_correct(
        object_number, owner)
