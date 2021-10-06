from behave import *

from framework.util.assert_util import AssertUtil
from framework.util.util import Util


@step('I received environment name as command line parameter')
def step_impl(context):
    context.pages.import_ub_performance_page().get_environment_name_from_cmd_line(context)


@step('I generated manifest file')
def step_impl(context):
    context.pages.import_ub_performance_page().generate_manifest_file()


@step('I executed stability test for "{number_of_hours}" hours')
def step_impl(context, number_of_hours):
    context.pages.import_ub_performance_page().execute_stability_test(context, number_of_hours)


@step('I clicked Insert Menu')
def step_impl(context):
    context.pages.import_ub_performance_page().click_insert_menu()


@step('I clicked Office Add-ins menu')
def step_impl(context):
    context.pages.import_ub_performance_page().click_office_add_ins_menu()


@step('I clicked Admin Managed menu')
def step_impl(context):
    context.pages.import_ub_performance_page().click_admin_managed_menu()


@step('I clicked Upload My Add-in')
def step_impl(context):
    context.pages.import_ub_performance_page().click_upload_add_in()


@step('I uploaded my Add-in file')
def step_impl(context):
    context.pages.import_ub_performance_page().upload_file_to_dialog_window()


@step('I clicked Upload button')
def step_impl(context):
    context.pages.import_ub_performance_page().click_upload_button()


@step('I clicked "{add_in_name}" Add-in button')
def step_impl(context, add_in_name):
    context.pages.excel_menu_browser_page.click_ub_add_in_button(add_in_name)


@step('I logged performance data to csv file')
def step_impl(context):
    context.pages.import_ub_performance_page().log_performance_data_csv(context)
