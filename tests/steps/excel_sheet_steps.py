import json

from behave import *

from util.assert_util import AssertUtil


@step('I selected cell "{cell_name}"')
def step_impl(context, cell_name):
    context.pages.excel_sheet_page().go_to_cell(cell_name)


@step('I wrote text "{text}" in cell "{cell_name}"')
def step_impl(context, text, cell_name):
    context.pages.excel_sheet_page().write_value_in_cell(cell_name, text)


@step('cell "{cell_name}" should have value "{expected_value}"')
def step_impl(context, cell_name, expected_value):
    result = context.pages.excel_sheet_page().get_cells_values([cell_name])

    AssertUtil.assert_simple(result, [expected_value])


@step('cell "{cell_name}" should be empty')
def step_impl(context, cell_name):
    result = context.pages.excel_sheet_page().get_cells_values([cell_name])

    AssertUtil.assert_simple(result, [None])


@step("cells {cells_names} should have values {expected_cells_values}")
def step_impl(context, cells_names, expected_cells_values):
    param_cells_names = json.loads(cells_names)

    result = context.pages.excel_sheet_page().get_cells_values(param_cells_names)

    expected_result = json.loads(expected_cells_values)

    AssertUtil.assert_simple(result, expected_result)


@step('number of worksheets should be {expected_number_of_worksheets}')
def step_impl(context, expected_number_of_worksheets):
    result = context.pages.excel_sheet_page().get_number_of_worksheets()

    AssertUtil.assert_simple(result, int(expected_number_of_worksheets))


@step('I added a new worksheet')
def step_impl(context):
    context.pages.excel_sheet_page().add_worksheet()


@step('I selected worksheet number {worksheet_number}')
def step_impl(context, worksheet_number):
    context.pages.excel_sheet_page().open_worksheet(worksheet_number)


@step('I removed {n} columns in a row starting with "{column_name}"')
def step_impl(context, column_name, n):
    context.pages.excel_sheet_page().remove_columns(column_name, n)
