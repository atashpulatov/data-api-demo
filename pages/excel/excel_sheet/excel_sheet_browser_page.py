import re

from selenium.webdriver.common.keys import Keys

from pages.base_browser_page import BaseBrowserPage


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

        cell_input = self.get_visible_element_by_id(ExcelSheetBrowserPage.CELL_TRAVERSAL_INPUT_ELEM)

        cell_input.click()
        self.pause(0.2)

        cell_input.send_keys(cell_upper)
        self.pause(0.2)

        cell_input.send_keys(Keys.ENTER)
        self.pause(0.2)

    def _get_selected_cell_value(self):
        cell_formatting_drop_down_elem = self.get_visible_element_by_xpath(
            ExcelSheetBrowserPage.CELL_FORMATTING_MENU_DROP_DOWN_ELEM)
        self.pause(0.2)

        cell_formatting_drop_down_elem.click()
        self.pause(0.2)

        self.click_element_by_id(
            ExcelSheetBrowserPage.CELL_FORMATTING_MENU_MORE_NUMBER_FORMATS_OPTION_ELEM)

        sample_input_elem = self.get_visible_element_by_id(ExcelSheetBrowserPage.FORMAT_CELLS_PROMPT_SAMPLE)

        sample_input_elem_value = sample_input_elem.get_attribute(self.FORMAT_CELLS_PROMPT_SAMPLE_VALUE_ATTR)

        formatted_value = self._format_value(sample_input_elem_value)

        value_elem = self.get_visible_elements_by_css(ExcelSheetBrowserPage.FORMAT_CELLS_PROMPT_BUTTON_ELEM)[1]
        self.click_element_simple(value_elem)

        return formatted_value if formatted_value else None

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

    # def _format_value_todo(self, value):
    #     '''
    #     TODO taken from original java code, rewrite it? comments copied
    #
    #     //TODO tmp solution for formatting ans since the browser account has different number delimiter settings
    #
    #     Helper to replace browser user preset of cell value format to sync between client applications.
    #     Can cause assertion issues between different input.
    #     Example cell value: "Books,Electronics" would be formatted as "Books Electronics"
    #     Replaces ',' to ' ' to sync thousands separator.
    #     Replaces '.' with ',' to sync decimal delimiter.
    #     '''
    #
    #     if not value or len(value) < 2:
    #         return value
    #
    #     arr = list(value)
    #     prev_char = arr[0]
    #     current_char = arr[1]
    #     for i in range(1, len(value) - 1):
    #         next_char = arr[i + 1]
    #
    #         if prev_char.isdigit() and next_char.isdigit():
    #             if current_char == ',':
    #                 arr[i] = ' '
    #             elif current_char == '.':
    #                 arr[i] = ','
    #
    #         prev_char = current_char
    #         current_char = next_char
    #
    #     return ''.join(arr)

    def get_number_of_worksheets(self):
        self.focus_on_excel_frame()

        return len(self.get_visible_elements_by_css(ExcelSheetBrowserPage.WORKSHEETS_TABS))

    def add_worksheet(self):
        self.focus_on_excel_frame()

        self.click_element_by_css(ExcelSheetBrowserPage.ADD_SHEET_BUTTON)

    def open_worksheet(self, worksheet_number):
        self.focus_on_excel_frame()

        worksheet_number_int = int(worksheet_number) + 1

        self.click_element_by_css(ExcelSheetBrowserPage.SELECT_SHEET_BUTTON % worksheet_number_int)
