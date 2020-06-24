from selenium.webdriver.common.keys import Keys

from pages.base_page import BasePage
from pages.page_util.image_element import ImageElement
from util.const import ELEMENT_SEARCH_RETRY_NUMBER


class ExcelSheetWindowsDesktopPage(BasePage):
    NAME_BOX_ELEM = 'Name Box'
    HOME_MENU_ITEM = 'Home'
    NUMBER_FORMAT_ELEM = 'Number Format'
    MORE_NUMBER_FORMATS_ELEM = 'More Number Formats...'
    SAMPLE_ELEM = 'Sample'

    VALUE_ATTRIBUTE = 'Value.Value'

    BOOK_ELEM = 'Book1'
    BOOK_CHILDREN_ELEMS = '//TabItem]'
    NAME_ATTRIBUTE = 'Name'
    SHEET_TAB_NAME = 'Sheet Tab'

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        self._go_to_cell(cell)  # first go to cell to ensure it's visible (scrolled to)

        value = self._get_selected_cell_value(cell)

        return value.strip() if value else value

    def _go_to_cell(self, cell):
        cell_upper = cell.upper()

        root_element = ImageElement.excel_element

        i = 0
        while i < ELEMENT_SEARCH_RETRY_NUMBER and not self._go_to_cell_single_check(cell_upper, root_element):
            self.pause(5)
            i += 1

    def _go_to_cell_single_check(self, cell_upper, element):
        try:
            element.click()
            element.send_keys_raw((Keys.CONTROL, 'g', Keys.CONTROL, cell_upper, Keys.ENTER))
            return True
        except Exception as e:
            self.log_warning('Error while executing _go_to_cell_single_check()')
            self.log_warning(e)

        return False

    def _get_selected_cell_value(self, cell):
        cell_selector_name = self._get_selector_name(cell)

        cell_elem = self.get_element_by_name(cell_selector_name)

        return cell_elem.get_attribute(ExcelSheetWindowsDesktopPage.VALUE_ATTRIBUTE)

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
        book_children_elements = book_element.find_elements_by_xpath(ExcelSheetWindowsDesktopPage.BOOK_CHILDREN_ELEMS)

        sheet_tab_elements = list(
            filter(lambda item: item.get_attribute(
                ExcelSheetWindowsDesktopPage.NAME_ATTRIBUTE).startswith(ExcelSheetWindowsDesktopPage.SHEET_TAB_NAME),
                   book_children_elements))

        return len(sheet_tab_elements)
