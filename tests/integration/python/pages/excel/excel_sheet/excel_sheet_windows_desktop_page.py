from selenium.webdriver.common.keys import Keys
from pyperclip import paste

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.image_element import ImageElement
from framework.util.excel_util import ExcelUtil
from framework.util.exception.MstrException import MstrException
from framework.util.const import AFTER_OPERATION_WAIT_TIME


class ExcelSheetWindowsDesktopPage(BaseWindowsDesktopPage):
    VALUE_ATTRIBUTE = 'Value.Value'

    BOOK_ELEM = 'Book1'
    BOOK_CHILDREN_ELEMS = '//TabItem'
    NAME_ATTRIBUTE = 'Name'
    SHEET_TAB_NAME = 'Sheet Tab'
    ADD_SHEET_BUTTON = 'Sheet Tab Add Sheet'

    TABLE_STYLE_XPATH = '//DataGrid[@Name="Quick Styles"]/Group/ListItem[@Name="{}"]'

    FONT_COLOR_XPATH = '//DataGrid[@Name="Font Color"]/Group/ListItem[@Name="{}"]'
    FILL_COLOR_XPATH = '//DataGrid[@Name="Fill Color"]/Group/ListItem[@Name="{}"]'

    ALIGN_MIDDLE_BUTTON = "Middle Align"
    ALIGN_LEFT_BUTTON = "Align Left"
    BOLD_BUTTON = "Bold"

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        # first go to cell to ensure it's visible (scrolled to)
        self.go_to_cell(cell)

        value = self._get_selected_cell_value(cell)

        return value.strip() if value else value

    def go_to_cell(self, cell):
        cell_upper = cell.upper()
        # Keys required to launch Find & Select menu in the Home tab.
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys(("F", "D", "G"))

        self.pause(AFTER_OPERATION_WAIT_TIME)

        ImageElement.excel_element.send_keys(cell_upper)

        self.pause(AFTER_OPERATION_WAIT_TIME)

        ImageElement.excel_element.send_keys(Keys.ENTER)

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def _get_selected_cell_value(self, cell):
        cell_selector_name = self._get_selector_name(cell)

        cell_elem = self.get_element_by_name(cell_selector_name)

        cell_value = cell_elem.get_attribute(
            ExcelSheetWindowsDesktopPage.VALUE_ATTRIBUTE)

        formatted_cell_value = ExcelUtil.format_cell_value(
            cell_value) if cell_value else ''

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

    def _navigate_to_home_tab_using_accessibility_keys(self):
        self._navigate_using_accessibility_keys()

        ImageElement.excel_element.send_keys("H")

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def _navigate_using_accessibility_keys(self):
        ImageElement.excel_element.send_keys(Keys.ALT)

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def get_number_of_worksheets(self):
        book_element = self.get_element_by_name(
            ExcelSheetWindowsDesktopPage.BOOK_ELEM)
        book_children_elements = book_element.get_elements_by_xpath(
            ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEMS)

        sheet_tab_elements = list(
            filter(lambda item: item.get_attribute(
                ExcelSheetWindowsDesktopPage.NAME_ATTRIBUTE).startswith(ExcelSheetWindowsDesktopPage.SHEET_TAB_NAME),
                book_children_elements))

        return len(sheet_tab_elements)

    def add_worksheet(self):
        self.get_element_by_name(
            ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON,
            image_name=self.prepare_image_name(
                ExcelSheetWindowsDesktopPage.ADD_SHEET_BUTTON)
        ).click()

    def open_worksheet(self, worksheet_number):
        worksheet_number_int = int(worksheet_number)

        book_element = self.get_element_by_name(
            ExcelSheetWindowsDesktopPage.BOOK_ELEM)
        book_children_elements = book_element.get_elements_by_xpath(
            ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEMS)

        i = 0
        for child in book_children_elements:
            if child.get_attribute(ExcelSheetWindowsDesktopPage.NAME_ATTRIBUTE).startswith(
                    ExcelSheetWindowsDesktopPage.SHEET_TAB_NAME):
                i += 1

                if i == worksheet_number_int:
                    child.click()
                    return

        raise MstrException(
            'Cannot open worksheet number: %s.' % worksheet_number)

    def click_table_design_tab(self):

        ImageElement.excel_element.send_keys(Keys.ALT)

        ImageElement.excel_element.send_keys(("J", "T"))

        ImageElement.excel_element.send_keys(Keys.ALT)

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_green_table_style(self):

        ImageElement.excel_element.send_keys(Keys.ALT)

        ImageElement.excel_element.send_keys(("J", "T", "S"))

        self.get_element_by_xpath(
            ExcelSheetWindowsDesktopPage.TABLE_STYLE_XPATH.format("Light Green, Table Style Light 21")).click()

    def click_home_tab(self):
        self._navigate_to_home_tab_using_accessibility_keys()
        # Turn off accessibility selectors
        ImageElement.excel_element.send_keys(Keys.ALT)

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_percentage_button(self):
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys("P")

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_comma_style_button(self):
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys("K")

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_align_middle_button(self):
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys(("A", "M"))

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_align_left_button(self):
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys(("A", "L"))

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_bold_button(self):
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys("1")

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_font_color_button(self):
        # TODO Select a specific font color. For now, just select the first
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys(("F", "C"))

        self.get_element_by_xpath(ExcelSheetWindowsDesktopPage.FONT_COLOR_XPATH.format("Light Green")).click()

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def click_fill_color_button(self):
        # TODO Select a specific fill color. For now, just select the first
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys(("H"))

        self.get_element_by_xpath(ExcelSheetWindowsDesktopPage.FILL_COLOR_XPATH.format("Light Green")).click()

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def _select_font_name_combo_box(self):
        self._navigate_to_home_tab_using_accessibility_keys()

        ImageElement.excel_element.send_keys(("F", "F"))

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def change_font_name_of_cell(self, cell_name, font_name):
        self.go_to_cell(cell_name)

        self._select_font_name_combo_box()

        ImageElement.excel_element.send_keys(font_name)

        self.pause(AFTER_OPERATION_WAIT_TIME)

        ImageElement.excel_element.send_keys(Keys.ENTER)

        self.pause(AFTER_OPERATION_WAIT_TIME)

    def is_align_middle_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetWindowsDesktopPage.ALIGN_MIDDLE_BUTTON)

    def is_align_left_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetWindowsDesktopPage.ALIGN_LEFT_BUTTON)

    def is_bold_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetWindowsDesktopPage.BOLD_BUTTON)

    def _is_button_selected(self, cell_name, name):
        self.go_to_cell(cell_name)

        return self.get_element_by_name(name).is_selected()

    def get_font_name_of_cell(self, cell_name):
        self.go_to_cell(cell_name)

        self._select_font_name_combo_box()

        ImageElement.excel_element.send_keys(Keys.CONTROL + "c")

        return paste()



