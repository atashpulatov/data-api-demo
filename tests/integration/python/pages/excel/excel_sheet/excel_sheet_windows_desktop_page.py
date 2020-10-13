from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.image_element import ImageElement
from framework.util.excel_util import ExcelUtil
from framework.util.exception.MstrException import MstrException


class ExcelSheetWindowsDesktopPage(BaseWindowsDesktopPage):
    NAME_BOX_ELEM = 'Name Box'
    HOME_MENU_ITEM = 'Home'
    NUMBER_FORMAT_ELEM = 'Number Format'
    MORE_NUMBER_FORMATS_ELEM = 'More Number Formats...'
    SAMPLE_ELEM = 'Sample'

    VALUE_ATTRIBUTE = 'Value.Value'

    BOOK_ELEM = 'Book1'
    BOOK_CHILDREN_ELEMS = '//TabItem'
    NAME_ATTRIBUTE = 'Name'
    SHEET_TAB_NAME = 'Sheet Tab'
    ADD_SHEET_BUTTON = 'Sheet Tab Add Sheet'

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        self.go_to_cell(cell)  # first go to cell to ensure it's visible (scrolled to)

        value = self._get_selected_cell_value(cell)

        return value.strip() if value else value

    def go_to_cell(self, cell):
        cell_upper = cell.upper()

        self.get_element_by_name(ExcelSheetWindowsDesktopPage.NAME_BOX_ELEM).click()

        ImageElement.excel_element.send_keys((cell_upper, Keys.ENTER))

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

    def get_number_of_worksheets(self):
        book_element = self.get_element_by_name(ExcelSheetWindowsDesktopPage.BOOK_ELEM)
        book_children_elements = book_element.get_elements_by_xpath(ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEMS)

        sheet_tab_elements = list(
            filter(lambda item: item.get_attribute(
                ExcelSheetWindowsDesktopPage.NAME_ATTRIBUTE).startswith(ExcelSheetWindowsDesktopPage.SHEET_TAB_NAME),
                   book_children_elements))

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
