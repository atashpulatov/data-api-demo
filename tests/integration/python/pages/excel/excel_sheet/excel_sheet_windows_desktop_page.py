import re
from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import Const
from framework.util.excel_util import ExcelUtil


class ExcelSheetWindowsDesktopPage(BaseWindowsDesktopPage):
    VALUE_ATTRIBUTE = 'Value.Value'

    WINDOW_ELEM = 'Window'
    BOOK_ELEM = 'Book1'
    GRID_ELEM = 'Grid'
    BOOK_CHILDREN_ELEMS = '//TabItem[@AutomationId="SheetTab"]'
    BOOK_CHILDREN_ELEM = '//TabItem[@AutomationId="SheetTab"][%s]'
    ADD_SHEET_BUTTON_NEW_EXCEL = 'Add Sheet'
    ADD_SHEET_BUTTON_OLD_EXCEL = 'Sheet Tab ' + ADD_SHEET_BUTTON_NEW_EXCEL
    ADD_SHEET_BUTTON_IMAGE = ADD_SHEET_BUTTON_NEW_EXCEL

    TABLE_STYLE_XPATH = '//DataGrid[@Name="Quick Styles"]/Group/ListItem[@Name="%s"]'

    FONT_COLOR_XPATH = '//DataGrid[@Name="Font Color"]/Group/ListItem[@Name="%s"]'
    FILL_COLOR_XPATH = '//DataGrid[@Name="Fill Color"]/Group/ListItem[@Name="%s"]'

    ALIGN_MIDDLE_BUTTON = "Middle Align"
    ALIGN_LEFT_BUTTON = "Align Left"
    BOLD_BUTTON = "Bold"
    LIGHT_GREEN_TABLE = "Light Green, Table Style Light 21"
    LIGHT_GREEN = "Light Green"

    RANGE_SELECTED_COLORS = ('#d2d2d2', '#cdf3df', '#d3f0e0', '#9fd5b7')  # default Office Theme colors
    COLUMN_CELL_HEADER_XPATH = '//HeaderItem[@Name="%s"]'

    THEME_COLORS_TITLE = 'Theme Colors'

    def get_cells_values(self, cells):
        result = []

        self._navigate_to_home_tab_and_press('hfo')

        for cell in cells:
            result.append(self._get_cell_value(cell))

        self._navigate_to_home_tab_and_press('hfo')

        return result

    def _get_cell_value(self, cell):
        # First go to cell to ensure it's visible (scrolled to).
        self.go_to_cell(cell)

        value = self._get_selected_cell_value()

        return value.strip() if value else value

    def go_to_cell(self, cell):
        cell_upper = cell.upper()

        self.press_f5()

        self.send_keys(cell_upper)

        self.press_enter()

    def _get_selected_cell_value(self):
        cell_value = self.get_selected_text_using_clipboard()
        self.press_escape()

        formatted_cell_value = ExcelUtil.format_cell_value(cell_value) if cell_value else ''

        return formatted_cell_value

    def write_value_in_cell(self, cell, value):
        self.go_to_cell(cell)
        self.send_keys((value, Keys.ENTER))

    def get_number_of_worksheets(self):
        book_element = self._get_book_element()
        book_children_elements = book_element.get_elements_by_xpath(ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEMS)

        return len(book_children_elements)

    def add_worksheet(self):
        is_add_button_visible_new_excel = self.check_if_element_exists_by_name(
            ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON_NEW_EXCEL,
            image_name=ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON_IMAGE,
            timeout=Const.SHORT_TIMEOUT
        )

        if is_add_button_visible_new_excel:
            self.get_element_by_name(
                ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON_NEW_EXCEL,
                image_name=ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON_IMAGE,
            ).click()
        else:
            self.get_element_by_name(
                ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON_OLD_EXCEL,
                image_name=ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON_IMAGE,
            ).click()

    def open_worksheet(self, worksheet_number):
        book_element = self._get_book_element()
        book_element.get_element_by_xpath(ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEM % worksheet_number).click()

    def _get_book_element(self):
        """
        Gets Book element.

        Usually it's Name attribute is ExcelSheetWindowsDesktopPage.BOOK_ELEM, if not - use fallback method.

        :return: Book element.
        """
        book_element = self.get_element_by_name(
            ExcelSheetWindowsDesktopPage.BOOK_ELEM,
            timeout=Const.SHORT_TIMEOUT,
            safe=True
        )

        if book_element:
            return book_element

        return self._get_book_element_fallback()

    def _get_book_element_fallback(self):
        """
        Fallback method for getting Book element.

        Gets first Window element and uses it's Name, after normalizing ('Book2 - Excel' -> 'Book2'), to find
        Book element.

        :return: Book element.
        """
        first_window_element = self.get_element_by_tag_name(ExcelSheetWindowsDesktopPage.WINDOW_ELEM)
        first_window_element_name = first_window_element.get_name_by_attribute()

        book_element_name = re.sub(' .*', '', first_window_element_name)

        return self.get_element_by_name(book_element_name)

    def remove_columns(self, first_column_to_be_deleted, number_of_columns_to_be_deleted):
        self.go_to_cell(f'{first_column_to_be_deleted}1')

        for i in range(int(number_of_columns_to_be_deleted)):
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

        self.pause(Const.AFTER_OPERATION_WAIT_TIME)

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

    def set_font_color(self, font_color):
        self._navigate_to_home_tab_and_press('fc')

        self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.FONT_COLOR_XPATH % font_color
        ).click()

    def set_fill_color(self, fill_color):
        self._navigate_to_home_tab_and_press('h')

        self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.FILL_COLOR_XPATH % fill_color
        ).click()

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

    def is_font_color_selected(self, cell_name, font_color):
        self.go_to_cell(cell_name)
        self._navigate_to_home_tab_and_press('fc')

        is_selected = self._check_if_color_selected(font_color)

        return is_selected

    def is_fill_color_selected(self, cell_name, fill_color):
        self.go_to_cell(cell_name)
        self._navigate_to_home_tab_and_press('h')

        is_selected = self._check_if_color_selected(fill_color)

        return is_selected

    def _check_if_color_selected(self, color):
        is_color_selected = self.get_element_by_name(color).is_selected()

        self.get_element_by_name(ExcelSheetWindowsDesktopPage.THEME_COLORS_TITLE).click()
        self.press_escape()

        return is_color_selected

    def get_font_name_of_cell(self, cell_name):
        self.go_to_cell(cell_name)

        self._select_font_name_combo_box()

        font_name = self.get_selected_text_using_clipboard()

        self.press_escape()

        return font_name

    def is_column_range_selected(self, column_names):
        return self._is_range_selected(column_names)

    def is_row_range_selected(self, row_names):
        return self._is_range_selected(row_names)

    def _is_range_selected(self, item_names):
        grid_element = self.get_element_by_accessibility_id(ExcelSheetWindowsDesktopPage.GRID_ELEM)

        for item_name in item_names:
            element_color = grid_element.get_element_by_xpath(
                ExcelSheetWindowsDesktopPage.COLUMN_CELL_HEADER_XPATH % item_name
            ).pick_color(10, 2)

            if element_color not in ExcelSheetWindowsDesktopPage.RANGE_SELECTED_COLORS:
                return False

        return True

    def _select_font_name_combo_box(self):
        self._navigate_to_home_tab_and_press('ff')

    def _navigate_to_home_tab_and_press(self, keys):
        self.get_element_by_name(
            'Home',
            image_name=self.prepare_image_name('Home')
        ).click()
        self.send_keys(Keys.ALT)
        self.send_keys(keys)
