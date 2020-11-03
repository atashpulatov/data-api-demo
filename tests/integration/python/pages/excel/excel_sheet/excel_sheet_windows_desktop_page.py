from pyperclip import paste
from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import AFTER_OPERATION_WAIT_TIME
from framework.util.excel_util import ExcelUtil
from framework.util.exception.MstrException import MstrException


class ExcelSheetWindowsDesktopPage(BaseWindowsDesktopPage):
    VALUE_ATTRIBUTE = 'Value.Value'

    BOOK_ELEM = 'Book1'
    BOOK_CHILDREN_ELEMS = '//TabItem'
    NAME_ATTRIBUTE = 'Name'
    SHEET_TAB_NAME = 'Sheet Tab'
    ADD_SHEET_BUTTON = 'Sheet Tab Add Sheet'

    TABLE_STYLE_XPATH = '//DataGrid[@Name="Quick Styles"]/Group/ListItem[@Name="%s"]'

    FONT_COLOR_XPATH = '//DataGrid[@Name="Font Color"]/Group/ListItem[@Name="%s"]'
    FILL_COLOR_XPATH = '//DataGrid[@Name="Fill Color"]/Group/ListItem[@Name="%s"]'

    ALIGN_MIDDLE_BUTTON = "Middle Align"
    ALIGN_LEFT_BUTTON = "Align Left"
    BOLD_BUTTON = "Bold"
    LIGHT_GREEN_TABLE = "Light Green, Table Style Light 21"
    LIGHT_GREEN = "Light Green"

    COLUMN_ROW_SELECTED_COLORS = [(210, 210, 210), (205, 243, 223)]
    COLUMN_CELL = '//HeaderItem[@Name="%s"]'
    COLUMN_CELL_IMAGE = '_column_%s'
    ROW_CELL_IMAGE = '_row_%s'

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        # First go to cell to ensure it's visible (scrolled to).
        self.go_to_cell(cell)

        value = self._get_selected_cell_value(cell)

        return value.strip() if value else value

    def go_to_cell(self, cell):
        cell_upper = cell.upper()

        self._navigate_to_home_tab_and_press('fdg')

        self.send_keys(cell_upper)

        self.press_enter()

    def _get_selected_cell_value(self, cell):
        cell_selector_name = self._get_selector_name(cell)

        cell_elem = self.get_element_by_name(cell_selector_name)

        cell_value = cell_elem.get_attribute(ExcelSheetWindowsDesktopPage.VALUE_ATTRIBUTE)

        formatted_cell_value = ExcelUtil.format_cell_value(cell_value) if cell_value else ''

        return formatted_cell_value

    def _get_selector_name(self, cell):
        cell_upper = cell.upper()

        result = []

        for char in list(cell_upper):
            if char.isalpha():
                result.append('"%s" ' % char)
            else:
                result.append(char)

        return ''.join(result)

    def write_value_in_cell(self, cell, value):
        self.go_to_cell(cell)
        self.send_keys((value, Keys.ENTER))

    def get_number_of_worksheets(self):
        book_element = self.get_element_by_name(ExcelSheetWindowsDesktopPage.BOOK_ELEM)
        book_children_elements = book_element.get_elements_by_xpath(ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEMS)

        sheet_tab_elements = list(
            filter(
                lambda item: item.get_attribute(
                    ExcelSheetWindowsDesktopPage.NAME_ATTRIBUTE
                ).startswith(ExcelSheetWindowsDesktopPage.SHEET_TAB_NAME), book_children_elements
            )
        )

        return len(sheet_tab_elements)

    def add_worksheet(self):
        self.get_element_by_name(
            ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON,
            image_name=self.prepare_image_name(ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON)
        ).click()

    def open_worksheet(self, worksheet_number):
        worksheet_number_int = int(worksheet_number)

        book_element = self.get_element_by_name(ExcelSheetWindowsDesktopPage.BOOK_ELEM)
        book_children_elements = book_element.get_elements_by_xpath(ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEMS)

        i = 0
        for child in book_children_elements:
            if child.get_attribute(ExcelSheetWindowsDesktopPage.NAME_ATTRIBUTE).startswith(
                    ExcelSheetWindowsDesktopPage.SHEET_TAB_NAME):
                i += 1

                if i == worksheet_number_int:
                    child.click()
                    return

        raise MstrException('Cannot open worksheet number: %s.' % worksheet_number)

    def remove_columns(self, column_name, number_of_columns):
        self.go_to_cell(f'{column_name}1')

        for i in range(0, int(number_of_columns)):
            self.send_keys_using_excel_element(Keys.CONTROL + Keys.SPACE)
            self.send_keys_using_excel_element(Keys.CONTROL + Keys.SUBTRACT)

    def click_table_design_tab(self):
        self.send_keys_using_excel_element(Keys.ALT)
        self.send_keys_using_excel_element(('j', 't'))
        self.send_keys_using_excel_element(Keys.ALT)

    def click_green_table_style(self):
        self.send_keys_using_excel_element(Keys.ALT)
        self.send_keys_using_excel_element(('j', 't', 's'))

        self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.TABLE_STYLE_XPATH % ExcelSheetWindowsDesktopPage.LIGHT_GREEN_TABLE
        ).click()

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_home_tab(self):
        self.send_keys_using_excel_element(Keys.ALT)
        self.send_keys_using_excel_element('h')
        self.send_keys_using_excel_element(Keys.ALT)

    def click_percentage_button(self):
        self._navigate_to_home_tab_and_press('p')

    def click_comma_style_button(self):
        self._navigate_to_home_tab_and_press('k')

    def click_align_middle_button(self):
        self._navigate_to_home_tab_and_press('am')

    def click_align_left_button(self):
        self._navigate_to_home_tab_and_press('al')

    def click_bold_button(self):
        self._navigate_to_home_tab_and_press('1')

    def click_font_color_button(self):
        # TODO Select a specific font color. For now, hardcode
        self._navigate_to_home_tab_and_press('fc')

        self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.FONT_COLOR_XPATH % ExcelSheetWindowsDesktopPage.LIGHT_GREEN
        ).click()

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_fill_color_button(self):
        # TODO Select a specific fill color. For now, hardcode
        self._navigate_to_home_tab_and_press('h')

        self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.FILL_COLOR_XPATH % ExcelSheetWindowsDesktopPage.LIGHT_GREEN
        ).click()

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def change_font_name_of_cell(self, cell_name, font_name):
        self.go_to_cell(cell_name)

        self._select_font_name_combo_box()

        self.send_keys(font_name)
        self.press_enter()

    def is_align_middle_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetWindowsDesktopPage.ALIGN_MIDDLE_BUTTON)

    def is_align_left_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetWindowsDesktopPage.ALIGN_LEFT_BUTTON)

    def is_bold_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetWindowsDesktopPage.BOLD_BUTTON)

    def _is_button_selected(self, cell_name, name):
        self.go_to_cell(cell_name)

        return self.get_element_by_name(name).is_selected()

    def is_font_color_selected(self):
        # TODO Select a specific font color. For now, hardcode
        self._navigate_to_home_tab_and_press('fc')

        return self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.FONT_COLOR_XPATH % ExcelSheetWindowsDesktopPage.LIGHT_GREEN
        ).is_selected()

    def is_fill_color_selected(self):
        # TODO Select a specific fill color. For now, hardcode
        self._navigate_to_home_tab_and_press('h')

        return self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.FILL_COLOR_XPATH % ExcelSheetWindowsDesktopPage.LIGHT_GREEN
        ).is_selected()

    def get_font_name_of_cell(self, cell_name):
        self.go_to_cell(cell_name)

        self._select_font_name_combo_box()

        self.send_keys(Keys.CONTROL + 'c')
        self.send_keys(Keys.CONTROL)
        self.press_escape()

        return paste()

    def is_column_range_selected(self, column_names):
        for column_name in column_names:
            elementColor = self.get_element_by_xpath(
                ExcelSheetWindowsDesktopPage.COLUMN_CELL % column_name
            ).pick_color(10, 2)

            if elementColor not in ExcelSheetWindowsDesktopPage.COLUMN_ROW_SELECTED_COLORS:
                return False

        return True

    def is_row_range_selected(self, row_names):
        for row_name in row_names:
            elementColor = self.get_element_by_xpath(
                ExcelSheetWindowsDesktopPage.COLUMN_CELL % row_name
            ).pick_color(10, 2)

            if elementColor not in ExcelSheetWindowsDesktopPage.COLUMN_ROW_SELECTED_COLORS:
                return False

        return True

    def _select_font_name_combo_box(self):
        self._navigate_to_home_tab_and_press('ff')

    def _navigate_to_home_tab_and_press(self, keys):
        self.send_keys(Keys.ALT + 'h')

        self.send_keys(Keys.ALT + keys)
