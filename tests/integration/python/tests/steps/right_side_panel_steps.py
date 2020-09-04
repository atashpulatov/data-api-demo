from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked Import Data button')
def step_impl(context):
    context.pages.right_panel_page().click_import_data_button_element()


@step('I clicked Add Data button')
def step_impl(context):
    context.pages.right_panel_page().click_add_data_button_element()


@step('I log out')
def step_impl(context):
    context.pages.right_panel_page().logout()


@step('I refreshed all objects')
def step_impl(context):
    context.pages.right_panel_page().refresh_all()


@step('I removed all objects')
def step_impl(context):
    context.pages.right_panel_page().remove_all()


@step('Right Panel is empty')
def step_impl(context):
    is_right_panel_empty = context.pages.right_panel_page().check_if_right_panel_is_empty()

    AssertUtil.assert_simple(is_right_panel_empty, True)


@step('I clicked clear data')
def step_impl(context):
    context.pages.right_panel_page().clear_data()


@step('I clicked view data')
def step_impl(context):
    context.pages.right_panel_page().view_data()


@step('I hovered over Log out')
def step_impl(context):
    context.pages.right_panel_page().hover_over_logout()
 

@step('I verified that the background color of the logout is "{color}"')
def step_impl(context, color):
    found_color = context.pages.right_panel_page().find_background_color_of_logout()

    AssertUtil.assert_simple(found_color, color)


@step('I clicked three dots settings menu')
def step_impl(context):
    context.pages.right_panel_page().click_three_dots_menu()


@step('Right panel has scrollbar')
def step_impl(context):
    is_scrollbar_visible = context.pages.right_panel_page().is_scrollbar_visible()

    AssertUtil.assert_simple(is_scrollbar_visible, True)
