import re

from selenium.webdriver.common.keys import Keys

from pages.base_browser_page import BaseBrowserPage
from util.const import DEFAULT_WAIT_AFTER_SEND_KEY


class ExcelSheetBrowserPage(BaseBrowserPage):
    CELL_TRAVERSAL_INPUT_ELEM = 'm_excelWebRenderer_ewaCtl_NameBox'

    CELL_FORMATTING_MENU_DROP_DOWN_ELEM = '''//span[contains(@id,'m_excelWebRenderer_ewaCtl_Number')]/a'''

    CELL_FORMATTING_MENU_MORE_NUMBER_FORMATS_OPTION_ELEM = 'm_excelWebRenderer_ewaCtl_Number.NumberFormatDialog-Menu32'

    FORMAT_CELLS_PROMPT_SAMPLE = 'sample'

    FORMAT_CELLS_PROMPT_SAMPLE_VALUE_ATTR = 'value'

    FORMAT_CELLS_PROMPT_BUTTON_ELEM = '#buttonarea > .ewa-dlg-button'

    WORKSHEETS_TABS = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div.ewa-stb-tabarea > ' \
                      'ul.ewa-stb-tabs > li'

    NUMBER_WITH_COMMA_RE = re.compile('^\d*\.*\d*$')
    NUMBER_DELIMITER_COMMA = ','
    NUMBER_DELIMITER_DOT = '.'

    ADD_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-navareaextra > a:nth-child(2)'

    SELECT_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div > ul > ' \
                          'li:nth-child(%s)'

    COLUMN_HEADER = '.ewrch-col-nosel > .ewr-chc'

    EXCEL_OPTION_MEDIUM_LABEL = '.cui-ctl-mediumlabel'

    OPTION_DELETE_COLUMNS = 'Delete Columns'

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        self.go_to_cell(cell)

        value = self._get_selected_cell_value()

        return value.strip() if value else value

    def go_to_cell(self, cell):
        cell_upper = cell.upper()

        # TODO called few times in java app
        self.focus_on_excel_frame()

        cell_input = self.get_element_by_id(ExcelSheetBrowserPage.CELL_TRAVERSAL_INPUT_ELEM)

        cell_input.click()
        self.pause(DEFAULT_WAIT_AFTER_SEND_KEY)

        cell_input.send_keys_raw(cell_upper)

        cell_input.send_keys_raw(Keys.ENTER)
        self.pause(DEFAULT_WAIT_AFTER_SEND_KEY)

    def _get_selected_cell_value(self):
        cell_formatting_drop_down_elem = self.get_element_by_xpath(
            ExcelSheetBrowserPage.CELL_FORMATTING_MENU_DROP_DOWN_ELEM
        )
        self.pause(0.2)

        cell_formatting_drop_down_elem.click()
        self.pause(0.2)

        self.get_element_by_id(
            ExcelSheetBrowserPage.CELL_FORMATTING_MENU_MORE_NUMBER_FORMATS_OPTION_ELEM
        ).click()

        sample_input_elem = self.get_element_by_id(ExcelSheetBrowserPage.FORMAT_CELLS_PROMPT_SAMPLE)

        sample_input_elem_value = sample_input_elem.get_attribute(self.FORMAT_CELLS_PROMPT_SAMPLE_VALUE_ATTR)

        formatted_value = self._format_value(sample_input_elem_value)

        value_elem = self.get_elements_by_css(ExcelSheetBrowserPage.FORMAT_CELLS_PROMPT_BUTTON_ELEM)[1]
        value_elem.click()

        return formatted_value if formatted_value else ''

    def _format_value(self, value):
        """
        Formats value.

        For number with comma as decimal delimiter: 42,42 -> 42.42.

        For other values no changes.

        :param value: value to format
        :return: formatted value.
        """

        if value and ExcelSheetBrowserPage.NUMBER_WITH_COMMA_RE.search(value):
            return value.replace(ExcelSheetBrowserPage.NUMBER_DELIMITER_COMMA,
                                 ExcelSheetBrowserPage.NUMBER_DELIMITER_DOT)

        return value

    def write_value_in_cell(self, cell, value):
        self.go_to_cell(cell)
        self.send_keys_raw(value)

    def get_number_of_worksheets(self):
        self.focus_on_excel_frame()

        return len(self.get_elements_by_css(ExcelSheetBrowserPage.WORKSHEETS_TABS))

    def add_worksheet(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.ADD_SHEET_BUTTON).click()

    def open_worksheet(self, worksheet_number):
        self.focus_on_excel_frame()

        worksheet_number_int = int(worksheet_number) + 1

        self.get_element_by_css(ExcelSheetBrowserPage.SELECT_SHEET_BUTTON % worksheet_number_int).click()

    def remove_column(self, column):
        self.focus_on_excel_frame()

        self.find_element_by_text_in_elements_list_by_css(ExcelSheetBrowserPage.COLUMN_HEADER, column).right_click()

        self.find_element_by_text_in_elements_list_by_css(
            ExcelSheetBrowserPage.EXCEL_OPTION_MEDIUM_LABEL,
            ExcelSheetBrowserPage.OPTION_DELETE_COLUMNS
        ).click()
