from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import DEFAULT_WAIT_AFTER_SEND_KEY
from framework.util.excel_util import ExcelUtil


class ExcelSheetBrowserPage(BaseBrowserPage):
    CELL_TRAVERSAL_INPUT_ELEM = 'm_excelWebRenderer_ewaCtl_NameBox'

    CELL_FORMATTING_MENU_DROP_DOWN_ELEM = '''//span[contains(@id,'m_excelWebRenderer_ewaCtl_Number')]/a'''

    CELL_FORMATTING_MENU_MORE_NUMBER_FORMATS_OPTION_ELEM = 'm_excelWebRenderer_ewaCtl_Number.NumberFormatDialog-Menu32'

    FORMAT_CELLS_PROMPT_SAMPLE = 'sample'

    FORMAT_CELLS_PROMPT_SAMPLE_VALUE_ATTR = 'value'

    FORMAT_CELLS_PROMPT_BUTTON_ELEM = '#buttonarea > .ewa-dlg-button'

    WORKSHEETS_TABS = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div.ewa-stb-tabarea > ' \
                      'ul.ewa-stb-tabs > li'

    ADD_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-navareaextra > a:nth-child(2)'

    SELECT_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div > ul > ' \
                          'li:nth-child(%s)'

    COLUMN_HEADER = '.ewrch-col-nosel > .ewr-chc'

    EXCEL_OPTION_MEDIUM_LABEL = '.cui-ctl-mediumlabel'

    OPTION_DELETE_COLUMNS = 'Delete Columns'

    TABLE_HOME_TAB = '#m_excelWebRenderer_ewaCtl_Ribbon\\.Home-title > a > span'
    TABLE_DESIGN_TAB = '#m_excelWebRenderer_ewaCtl_Ribbon\\.Table\\.Design-title > a > span'
    GREEN_TABLE_STYLE = '#m_excelWebRenderer_ewaCtl_Ribbon\\.TableTools\\.TableStyles\\.Style6-Large > div > div > table'

    PERCENTAGE_BUTTON = '#m_excelWebRenderer_ewaCtl_Number\\.Percentage-Medium'
    COMMA_STYLE_BUTTON = '#m_excelWebRenderer_ewaCtl_Number\\.NumberFormatComma-Medium'

    ALIGN_MIDDLE_BUTTON = '#m_excelWebRenderer_ewaCtl_Alignment\\.AlignMiddle-Medium'
    ALIGN_LEFT_BUTTON = '#m_excelWebRenderer_ewaCtl_Alignment\\.AlignLeft-Medium'

    EXCEL_FONT_NAME = '#m_excelWebRenderer_ewaCtl_Font\.FontName-Medium'
    BOLD_BUTTON = '#m_excelWebRenderer_ewaCtl_Font\\.Bold-Small'
    FONT_COLOR_BUTTON = '#m_excelWebRenderer_ewaCtl_Font\\.FontColorWithSplit-Small'
    FILL_COLOR_BOTTON = '#m_excelWebRenderer_ewaCtl_Font\\.FillColorWithSplit-Small'

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

        sample_input_elem_value = sample_input_elem.get_attribute(self.FORMAT_CELLS_PROMPT_SAMPLE_VALUE_ATTR)

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
                ExcelSheetBrowserPage.EXCEL_OPTION_MEDIUM_LABEL,
                ExcelSheetBrowserPage.OPTION_DELETE_COLUMNS
            ).click()

    def click_table_design_tab(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.TABLE_DESIGN_TAB).click()

    def click_green_table_style(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.GREEN_TABLE_STYLE).click()

    def click_home_tab(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.TABLE_HOME_TAB).click()

    def click_percentage_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.PERCENTAGE_BUTTON).click()

    def click_comma_style_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.COMMA_STYLE_BUTTON).click()

    def click_align_middle_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.ALIGN_MIDDLE_BUTTON).click()

    def click_align_left_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.ALIGN_LEFT_BUTTON).click()

    def click_bold_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.BOLD_BUTTON).click()

    def click_font_color_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.FONT_COLOR_BUTTON).click()

    def click_fill_color_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.FILL_COLOR_BOTTON).click()

    def change_font_name_of_cell(self, cell_name, font_name):
        self.go_to_cell(cell_name)

        self.get_element_by_css(ExcelSheetBrowserPage.EXCEL_FONT_NAME).click()
        self.press_backspace()
        self.send_keys(font_name)
        self.press_enter()