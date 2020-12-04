from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import DEFAULT_WAIT_AFTER_SEND_KEY
from framework.util.excel_util import ExcelUtil


class ExcelSheetBrowserPage(BaseBrowserPage):
    ATTRIBUTE_NAME_VALUE = 'value'
    ATTRIBUTE_NAME_ARIA_PRESSED = 'aria-pressed'

    CELL_TRAVERSAL_INPUT_ELEM = 'm_excelWebRenderer_ewaCtl_NameBox'

    CELL_FORMATTING_MENU_DROP_DOWN_ELEM = '''//span[contains(@id,'m_excelWebRenderer_ewaCtl_Number')]/a'''

    CELL_FORMATTING_MENU_MORE_NUMBER_FORMATS_OPTION_ELEM = 'm_excelWebRenderer_ewaCtl_Number.NumberFormatDialog-Menu32'

    FORMAT_CELLS_PROMPT_SAMPLE = 'sample'

    FORMAT_CELLS_PROMPT_BUTTON_ELEM = '#buttonarea > .ewa-dlg-button'

    WORKSHEETS_TABS = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div.ewa-stb-tabarea > ' \
                      'ul.ewa-stb-tabs > li'

    ADD_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > .ewa-stb-navareaextra > .ewa-stb-navbutton'

    SELECT_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div > ul > ' \
                          'li:nth-child(%s)'

    COLUMN_HEADER = '.ewrch-col-nosel > .ewr-chc'

    EXCEL_COLUMN_OPTION_CSS = '.label-97'

    OPTION_DELETE_COLUMNS = 'Delete Columns'

    TABLE_HOME_TAB = 'm_excelWebRenderer_ewaCtl_Ribbon.Home-title'
    TABLE_DESIGN_TAB = 'm_excelWebRenderer_ewaCtl_Ribbon.Table.Design-title'
    GREEN_TABLE_STYLE = 'm_excelWebRenderer_ewaCtl_Ribbon.TableTools.TableStyles.Style6-Large'

    PERCENTAGE_BUTTON = 'm_excelWebRenderer_ewaCtl_Number.Percentage-Medium'

    COMMA_STYLE_BUTTON = 'm_excelWebRenderer_ewaCtl_Number.NumberFormatComma-Medium'

    ALIGN_MIDDLE_BUTTON = 'm_excelWebRenderer_ewaCtl_Alignment.AlignMiddle-Medium'
    ALIGN_LEFT_BUTTON = 'm_excelWebRenderer_ewaCtl_Alignment.AlignLeft-Medium'

    EXCEL_FONT_NAME_SPAN = 'm_excelWebRenderer_ewaCtl_Font.FontName-Medium'
    EXCEL_FONT_NAME_INPUT = 'm_excelWebRenderer_ewaCtl_Font.FontName'

    BOLD_BUTTON = 'm_excelWebRenderer_ewaCtl_Font.Bold-Small'
    FONT_COLOR_BUTTON = 'm_excelWebRenderer_ewaCtl_Font.FontColorWithSplit-Small'
    FILL_COLOR_BUTTON = 'm_excelWebRenderer_ewaCtl_Font.FillColorWithSplit-Small'

    BUTTON_SELECTED_ARIA_VALUE = 'true'

    EXCEL_SELECTED_COLUMN_HEADER = '.ewrch-col-cellsel > .ewr-chc'
    EXCEL_SELECTED_ROW_HEADER = '.ewrch-row-cellsel > .ewr-rhc'

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

        cell_input.send_keys(cell_upper)

        cell_input.send_keys(Keys.ENTER)
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

        sample_input_elem_value = sample_input_elem.get_attribute(ExcelSheetBrowserPage.ATTRIBUTE_NAME_VALUE)

        formatted_value = ExcelUtil.format_cell_value(sample_input_elem_value)

        value_elem = self.get_elements_by_css(ExcelSheetBrowserPage.FORMAT_CELLS_PROMPT_BUTTON_ELEM)[1]
        value_elem.click()

        return formatted_value if formatted_value else ''

    def write_value_in_cell(self, cell, value):
        self.go_to_cell(cell)
        self.send_keys(value)

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

    def remove_columns(self, column_name, number_of_columns):
        self.focus_on_excel_frame()

        for i in range(0, int(number_of_columns)):
            self.go_to_cell('%s1' % column_name)

            self.press_tab()

            self.find_element_by_text_in_elements_list_by_css(
                ExcelSheetBrowserPage.COLUMN_HEADER, column_name).right_click()

            self.find_element_by_text_in_elements_list_by_css(
                ExcelSheetBrowserPage.EXCEL_COLUMN_OPTION_CSS,
                ExcelSheetBrowserPage.OPTION_DELETE_COLUMNS
            ).click()

    def click_table_design_tab(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.TABLE_DESIGN_TAB).click()

    def click_green_table_style(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.GREEN_TABLE_STYLE).click()

    def click_home_tab(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.TABLE_HOME_TAB).click()

    def click_percentage_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.PERCENTAGE_BUTTON).click()

    def click_comma_style_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.COMMA_STYLE_BUTTON).click()

    def click_align_middle_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.ALIGN_MIDDLE_BUTTON).click()

    def click_align_left_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.ALIGN_LEFT_BUTTON).click()

    def click_bold_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.BOLD_BUTTON).click()

    def click_font_color_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.FONT_COLOR_BUTTON).click()

    def click_fill_color_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.FILL_COLOR_BUTTON).click()

    def change_font_name_of_cell(self, cell_name, font_name):
        self.go_to_cell(cell_name)

        self.get_element_by_id(ExcelSheetBrowserPage.EXCEL_FONT_NAME_SPAN).click()
        self.press_backspace()
        self.send_keys(font_name)
        self.press_enter()

    def is_align_middle_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetBrowserPage.ALIGN_MIDDLE_BUTTON)

    def is_align_left_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetBrowserPage.ALIGN_LEFT_BUTTON)

    def is_bold_button_selected(self, cell_name):
        return self._is_button_selected(cell_name, ExcelSheetBrowserPage.BOLD_BUTTON)

    def _is_button_selected(self, cell_name, selector):
        self.go_to_cell(cell_name)

        formatting_button = self.get_element_by_id(selector)
        aria_attribute_value = formatting_button.get_attribute(ExcelSheetBrowserPage.ATTRIBUTE_NAME_ARIA_PRESSED)

        return aria_attribute_value == ExcelSheetBrowserPage.BUTTON_SELECTED_ARIA_VALUE

    def get_font_name_of_cell(self, cell_name):
        self.go_to_cell(cell_name)

        self.get_element_by_id(ExcelSheetBrowserPage.EXCEL_FONT_NAME_SPAN).click()

        font_input = self.get_element_by_id(ExcelSheetBrowserPage.EXCEL_FONT_NAME_INPUT)

        return font_input.get_attribute(ExcelSheetBrowserPage.ATTRIBUTE_NAME_VALUE)

    def is_column_range_selected(self, column_names):
        self.focus_on_excel_frame()

        for column_name in column_names:
            element = self.find_element_by_text_in_elements_list_by_css_safe(
                ExcelSheetBrowserPage.EXCEL_SELECTED_COLUMN_HEADER,
                column_name
            )

            if not element:
                return False

        return True

    def is_row_range_selected(self, row_names):
        self.focus_on_excel_frame()

        for row_name in row_names:
            element = self.find_element_by_text_in_elements_list_by_css_safe(
                ExcelSheetBrowserPage.EXCEL_SELECTED_ROW_HEADER,
                row_name
            )

            if not element:
                return False

        return True
