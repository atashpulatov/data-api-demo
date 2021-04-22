import json

from behave import *

from framework.util.assert_util import AssertUtil


@step('I selected cell "{cell_name}"')
def step_impl(context, cell_name):
    context.pages.excel_sheet_page().go_to_cell(cell_name)


@step('I merged range from "{start_cell}" to "{end_cell}"')
def step_impl(context, start_cell, end_cell):
    context.pages.excel_sheet_page().merge_range(start_cell, end_cell)


@step('I entered text "{text}" into cell "{cell_name}" after selecting it')
def step_impl(context, text, cell_name):
    context.pages.excel_sheet_page().write_value_in_cell(cell_name, text)


@step('I verified that cell "{cell_name}" has value "{expected_value}"')
def step_impl(context, cell_name, expected_value):
    result = context.pages.excel_sheet_page().get_cells_values([cell_name])

    AssertUtil.assert_simple(result, [expected_value])


@step('I verified that cell "{cell_name}" is empty')
def step_impl(context, cell_name):
    result = context.pages.excel_sheet_page().get_cells_values([cell_name])

    AssertUtil.assert_simple(result, [None])


@step("I verified that cells {cells_names} have values {expected_cells_values}")
def step_impl(context, cells_names, expected_cells_values):
    param_cells_names = json.loads(cells_names)

    result = context.pages.excel_sheet_page().get_cells_values(param_cells_names)

    expected_result = json.loads(expected_cells_values)

    AssertUtil.assert_simple(result, expected_result)


@step('I verified that number of worksheets is {expected_number_of_worksheets}')
def step_impl(context, expected_number_of_worksheets):
    result = context.pages.excel_sheet_page().get_number_of_worksheets()

    AssertUtil.assert_simple(result, int(expected_number_of_worksheets))


@step('I added a new worksheet')
def step_impl(context):
    context.pages.excel_sheet_page().add_worksheet()


@step('I selected worksheet number {worksheet_number}')
def step_impl(context, worksheet_number):
    context.pages.excel_sheet_page().open_worksheet(worksheet_number)


@step('I removed {number_of_columns_to_be_deleted} columns starting from column "{first_column_to_be_deleted}"')
def step_impl(context, number_of_columns_to_be_deleted, first_column_to_be_deleted):
    context.pages.excel_sheet_page().remove_columns(first_column_to_be_deleted, number_of_columns_to_be_deleted)


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


@step('I changed font color to "{font_color}"')
def step_impl(context, font_color):
    context.pages.excel_sheet_page().set_font_color(font_color)


@step('I changed fill color to "{fill_color}"')
def step_impl(context, fill_color):
    context.pages.excel_sheet_page().set_fill_color(fill_color)


@step('I changed cell "{cell_name}" font name to "{font_name}"')
def step_impl(context, cell_name, font_name):
    context.pages.excel_sheet_page().change_font_name_of_cell(cell_name, font_name)


@step('I verified that align middle button is selected for cell "{cell_name}"')
def step_impl(context, cell_name):
    button_selected = context.pages.excel_sheet_page().is_align_middle_button_selected(cell_name)

    AssertUtil.assert_simple(button_selected, True)


@step('I verified that align left button is selected for cell "{cell_name}"')
def step_impl(context, cell_name):
    button_selected = context.pages.excel_sheet_page().is_align_left_button_selected(cell_name)

    AssertUtil.assert_simple(button_selected, True)


@step('I verified that bold button is selected for cell "{cell_name}"')
def step_impl(context, cell_name):
    button_selected = context.pages.excel_sheet_page().is_bold_button_selected(cell_name)

    AssertUtil.assert_simple(button_selected, True)


@step('I verified that for cell "{cell_name}" font name is "{expected_name}"')
def step_impl(context, cell_name, expected_name):
    result = context.pages.excel_sheet_page().get_font_name_of_cell(cell_name)

    AssertUtil.assert_simple(result, expected_name)


@step('I verified that columns {column_names} are selected')
def step_impl(context, column_names):
    param_column_names = json.loads(column_names)

    result = context.pages.excel_sheet_page().is_column_range_selected(param_column_names)

    AssertUtil.assert_simple(result, True)


@step('I verified that rows {row_names} are selected')
def step_impl(context, row_names):
    param_row_names = json.loads(row_names)

    result = context.pages.excel_sheet_page().is_row_range_selected(param_row_names)

    AssertUtil.assert_simple(result, True)


@step('I verified that for cell "{cell_name}" font color "{font_color}" is selected')
def step_impl(context, cell_name, font_color):
    font_color_selected = context.pages.excel_sheet_page().is_font_color_selected(cell_name, font_color)

    AssertUtil.assert_simple(font_color_selected, True)


@step('I verified that for cell "{cell_name}" fill color "{fill_color}" is selected')
def step_impl(context, cell_name, fill_color):
    fill_color_selected = context.pages.excel_sheet_page().is_fill_color_selected(cell_name, fill_color)

    AssertUtil.assert_simple(fill_color_selected, True)


@step('I hid columns {column_names}')
def step_impl(context, column_names):
    param_column_names = json.loads(column_names)

    context.pages.excel_sheet_page().hide_columns(param_column_names)


@step('I hid rows {row_names}')
def step_impl(context, row_names):
    param_row_names = json.loads(row_names)

    context.pages.excel_sheet_page().hide_rows(param_row_names)


@step('I resized column "{column_name}" to width "{new_width}" default units')
def step_impl(context, column_name, new_width):
    context.pages.excel_sheet_page().resize_column(column_name, new_width)


@step('I verified columns {column_names} are hidden')
def step_impl(context, column_names):
    param_column_names = json.loads(column_names)

    columns_hidden = context.pages.excel_sheet_page().are_columns_hidden(param_column_names)

    AssertUtil.assert_simple(columns_hidden, True)


@step('I verified rows {row_names} are hidden')
def step_impl(context, row_names):
    param_row_names = json.loads(row_names)

    cells_hidden = context.pages.excel_sheet_page().are_rows_hidden(param_row_names)

    AssertUtil.assert_simple(cells_hidden, True)


@step('I verified column "{column_name}" has width "{expected_width}" default units')
def step_impl(context, column_name, expected_width):
    column_has_given_width = context.pages.excel_sheet_page().verify_column_width(column_name, expected_width)

    AssertUtil.assert_simple(column_has_given_width, True)
