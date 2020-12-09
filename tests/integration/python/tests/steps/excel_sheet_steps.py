import json

from behave import *

from framework.util.assert_util import AssertUtil


@step('I selected cell "{cell_name}"')
def step_impl(context, cell_name):
    context.pages.excel_sheet_page().go_to_cell(cell_name)


@step('I merged range from "{start_cell}" to "{end_cell}"')
def step_impl(context, start_cell, end_cell):
    context.pages.excel_sheet_page().merge_range(start_cell, end_cell)


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


@step('I removed {number_of_columns} columns starting from column "{column_name}"')
def step_impl(context, number_of_columns, column_name):
    context.pages.excel_sheet_page().remove_columns(column_name, number_of_columns)


@step('I clicked table design tab')
def step_impl(context):
    context.pages.excel_sheet_page().click_table_design_tab()


@step('I clicked green table style')
def step_impl(context):
    context.pages.excel_sheet_page().click_green_table_style()


@step('I clicked home tab')
def step_impl(context):
    context.pages.excel_sheet_page().click_home_tab()


@step('I clicked percentage button')
def step_impl(context):
    context.pages.excel_sheet_page().click_percentage_button()


@step('I clicked comma style button')
def step_impl(context):
    context.pages.excel_sheet_page().click_comma_style_button()


@step('I clicked align middle button')
def step_impl(context):
    context.pages.excel_sheet_page().click_align_middle_button()


@step('I clicked align left button')
def step_impl(context):
    context.pages.excel_sheet_page().click_align_left_button()


@step('I clicked bold button')
def step_impl(context):
    context.pages.excel_sheet_page().click_bold_button()


@step('I clicked font color button')
def step_impl(context):
    context.pages.excel_sheet_page().click_font_color_button()


@step('I clicked fill color button')
def step_impl(context):
    context.pages.excel_sheet_page().click_fill_color_button()


@step('I changed cell "{cell_name}" font name to "{font_name}"')
def step_impl(context, cell_name, font_name):
    context.pages.excel_sheet_page().change_font_name_of_cell(cell_name, font_name)


@step('for cell "{cell_name}" align middle button should be selected')
def step_impl(context, cell_name):
    button_selected = context.pages.excel_sheet_page().is_align_middle_button_selected(cell_name)

    AssertUtil.assert_simple(button_selected, True)


@step('for cell "{cell_name}" align left button should be selected')
def step_impl(context, cell_name):
    button_selected = context.pages.excel_sheet_page().is_align_left_button_selected(cell_name)

    AssertUtil.assert_simple(button_selected, True)


@step('for cell "{cell_name}" bold button should be selected')
def step_impl(context, cell_name):
    button_selected = context.pages.excel_sheet_page().is_bold_button_selected(cell_name)

    AssertUtil.assert_simple(button_selected, True)


@step('for cell "{cell_name}" font name should be "{expected_name}"')
def step_impl(context, cell_name, expected_name):
    result = context.pages.excel_sheet_page().get_font_name_of_cell(cell_name)

    AssertUtil.assert_simple(result, expected_name)


@step('columns {column_names} are selected')
def step_impl(context, column_names):
    param_column_names = json.loads(column_names)

    result = context.pages.excel_sheet_page().is_column_range_selected(param_column_names)

    AssertUtil.assert_simple(result, True)


@step('rows {row_names} are selected')
def step_impl(context, row_names):
    param_row_names = json.loads(row_names)

    result = context.pages.excel_sheet_page().is_row_range_selected(param_row_names)

    AssertUtil.assert_simple(result, True)
