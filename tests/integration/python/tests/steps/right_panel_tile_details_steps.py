from behave import *


@step('I hovered over show details button on object {object_number}')
def step_impl(context, object_number):
    context.pages.right_panel_tile_details_page().hover_over_show_details_button(object_number)
