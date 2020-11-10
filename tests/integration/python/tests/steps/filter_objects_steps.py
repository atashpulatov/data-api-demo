from behave import *

from framework.util.assert_util import AssertUtil


@step('I opened All for Owner category')
def step_impl(context):
    context.pages.filter_panel_page().click_owner_all_panel()


@step('I opened All for Modified category')
def step_impl(context):
    context.pages.filter_panel_page().click_modified_all_panel()


@step('I clicked Select All within All Panel')
def step_impl(context):
    context.pages.filter_panel_page().click_select_all_within_all_panel()


@step('I clicked "{modified_element}" within Modified All Panel')  
def step_impl(context,modified_element):
    context.pages.filter_panel_page().click_modified_all_panel_element(modified_element)


@step('I clicked Type "{object_type}"')
def step_impl(context, object_type):
    context.pages.filter_panel_page().click_element_from_list('Type', object_type)


@step('I clicked Application "{application}"')
def step_impl(context, application):
    context.pages.filter_panel_page().click_element_from_list('Application', application)


@step('I clicked "{element}" from "{category}" category')
def step_impl(context, element, category):
    context.pages.filter_panel_page().click_element_from_list(category, element)


@step('I clicked first element with 0 objects in All Panel')
def step_impl(context):
    context.pages.filter_panel_page().click_all_panel_first_empty_element()


@step('the first element with 0 objects in All Panel should be selected')
def step_impl(context):
    is_checked = context.pages.filter_panel_page().examine_if_first_empty_element_is_checked()

    AssertUtil.assert_simple(is_checked, True)


@step('the first element with 0 objects in All Panel should NOT be selected')
def step_impl(context):
    is_checked = context.pages.filter_panel_page().examine_if_first_empty_element_is_checked()

    AssertUtil.assert_simple(is_checked, False)


@step('element "{element_name}" has focus')
def step_impl(context, element_name):
    has_focus = context.pages.filter_panel_page().examine_if_element_has_focus(element_name)

    AssertUtil.assert_simple(has_focus, True)


@step('verified that Certified Status category header on My Library has correct title')
def step_impl(context):
    element_title = context.pages.filter_panel_page().get_certified_header_on_mylibrary_title()

    AssertUtil.assert_simple(element_title, 'Certified Status')


@step('verified that Certified Status category on My Library has element Certified')
def step_impl(context):
    element_title = context.pages.filter_panel_page().get_certified_element_on_mylibrary_title()

    AssertUtil.assert_simple(element_title, 'Certified')


@step('verified that Owner category header on My Library has title "{title}"')
def step_impl(context, title):
    element_title = context.pages.filter_panel_page().get_owner_header_on_mylibrary_title()

    AssertUtil.assert_simple(element_title, title)


@step('verified that Modified category header on My Library has correct title')
def step_impl(context):
    element_title = context.pages.filter_panel_page().get_modified_header_on_mylibrary_title()

    AssertUtil.assert_simple(element_title, 'Modified')


@step('verified that Modified category on My Library has From field')
def step_impl(context):
    element_title = context.pages.filter_panel_page().get_modified_from_field_on_mylibrary_title()

    AssertUtil.assert_simple(element_title, 'From')


@step('verified that Modified category on My Library has To field')
def step_impl(context):
    element_title = context.pages.filter_panel_page().get_modified_to_field_on_mylibrary_title()

    AssertUtil.assert_simple(element_title, 'To')


@step('verified that Clear All on My Library has correct name')
def step_impl(context):
    element_title = context.pages.filter_panel_page().get_clear_all_on_mylibrary_title()

    AssertUtil.assert_simple(element_title, 'Clear All')


@step('verified that Application category header has title "{title}"')
def step_impl(context, title):
    element_title = context.pages.filter_panel_page().get_application_header_title()

    AssertUtil.assert_simple(element_title, title)
@step('I pressed Tab key until element "{element_name}" has focus')
def step_impl(context, element_name):
    context.pages.filter_panel_page().press_tab_until_focused(element_name)
