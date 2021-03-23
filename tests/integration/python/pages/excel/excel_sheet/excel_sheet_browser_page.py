from abc import ABC

from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const


class ExcelSheetBrowserPage(ABC, BaseBrowserPage):
    ATTRIBUTE_NAME_VALUE = 'value'
    ATTRIBUTE_NAME_ARIA_PRESSED = 'aria-pressed'

    WORKSHEETS_TABS = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div.ewa-stb-tabarea > ' \
                      'ul.ewa-stb-tabs > li'

    ADD_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > .ewa-stb-navareaextra > .ewa-stb-navbutton'

    SELECT_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div > ul > ' \
                          'li:nth-child(%s)'

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

    RANGE_SEPARATOR = ':'

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        self.go_to_cell(cell)

        value = self.get_selected_cell_value()

        return value.strip() if value else value

    def go_to_cell(self, cell):
        self.select_cell_or_range(cell)

    def merge_range(self, start_cell, end_cell):
        self._select_range(start_cell, end_cell)
        self.send_keys(Keys.LEFT_ALT)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.send_keys("h")
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)
        
        self.send_keys("m")
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)
        
        self.send_keys("c")
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

    def _select_range(self, start_cell, end_cell):
        self.select_cell_or_range(start_cell + ExcelSheetBrowserPage.RANGE_SEPARATOR + end_cell)

    def write_value_in_cell(self, cell, value):
        self.go_to_cell(cell)
        self.send_keys(value)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)
        self.send_keys(Keys.ENTER)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

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

    def set_font_color(self, font_color):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.FONT_COLOR_BUTTON).click()

    def set_fill_color(self, fill_color):
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
