from behave import *

from framework.util.assert_util import AssertUtil


@step('I set Display attribute form names to "{form_visualization_type}"')
def step_impl(context, form_visualization_type):
    context.pages.display_attriubute_form_names_page().select_display_attributes_form_names_element(
        form_visualization_type
    )


@step('I selected the first option from Display attribute form names')
def step_impl(context):
    context.pages.display_attriubute_form_names_page().select_first_display_attributes_form_names_element()


@step('I verified that the background color of the first option in Display attribute form names is "{color}"')
def step_impl(context, color):
    found_color = context.pages.display_attriubute_form_names_page(). \
        get_background_color_of_first_attribute_form_names_element()

    AssertUtil.assert_simple(found_color, color)
