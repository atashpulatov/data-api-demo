from behave import *

from framework.util.assert_util import AssertUtil


@step('I clicked close Add-in button')
def step_impl(context):
    context.pages.excel_menu_page().click_close_add_in_button()


@step('I clicked Add-in icon')
def step_impl(context):
    context.pages.excel_menu_page().click_add_in_elem()


@step('I selected object number {object_number} from Name Box')
def step_impl(context, object_number):
    context.pages.excel_menu_page().select_object_from_name_box(object_number)


@step('I verified that the name of item number {object_number} '
      'in Name Box, ignoring timestamp at the end, is "{expected_name}"')
def step_impl(context, object_number, expected_name):
    name_is_correct = context.pages.excel_menu_page().is_object_name_in_name_box_correct(object_number, expected_name)

    AssertUtil.assert_simple(name_is_correct, True)


@step('I verified that object number {object_number_1} and object number {object_number_2} '
      'in Name Box have different timestamps')
def step_impl(context, object_number_1, object_number_2):
    timestamps_are_equal = context.pages.excel_menu_page().are_timestamps_equal(object_number_1, object_number_2)

    AssertUtil.assert_simple(timestamps_are_equal, False)


@step('I stored environment id in context')
def step_impl(context):
    """
    Technical step used to store environment_id in context, necessary for REST API calls. Environment id is taken from
    Add-In name, e.g. NNNNNN for current_env_RV_NNNNNN.
    """
    context.environment_id = context.pages.excel_menu_page().get_environment_id()
