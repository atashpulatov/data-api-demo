from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked toggle details button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().click_toggle_details_button(object_number)


@step('I hovered over toggle details button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().hover_over_toggle_details_button(object_number)


@step('Tooltip text for object {object_number} toggle details button is {expected_tooltip_text}')
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
