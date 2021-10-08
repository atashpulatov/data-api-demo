from abc import ABC, abstractmethod

from pyperclip import paste
from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.excel_util import ExcelUtil
from framework.util.exception.mstr_exception import MstrException
from pages.excel.excel_menu.excel_menu_browser_page import ExcelMenuBrowserPage


class ExcelSheetBrowserPage(ABC, BaseBrowserPage):
    ATTRIBUTE_NAME_VALUE = 'value'
    ATTRIBUTE_NAME_ARIA_PRESSED = 'aria-pressed'

    ADD_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > .ewa-stb-navareaextra > .ewa-stb-navbutton'

    SELECT_SHEET_BUTTON = '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-contentarea > div > ul > ' \
                          'li:nth-child(%s)'

    SHEET_DROPDOWN_BUTTON_CSS = ".ms-ComboBox-CaretDown-button"
    WORKSHEETS_IN_GOTO_POPUP_SELECTOR = '#comboBoxIDDropdown button'

    TABLE_HOME_TAB = 'm_excelWebRenderer_ewaCtl_Ribbon.Home-title'
    TABLE_DESIGN_TAB_ID = 'Table'
    GREEN_TABLE_STYLE_ID = 'PreviewTableFormatStyle1'

    PERCENTAGE_BUTTON_ID = 'NumberFormatPercentage_MLR'
    COMMA_STYLE_BUTTON_ID = 'NumberFormatComma_MLR'

    ALIGN_MIDDLE_BUTTON = '[data-unique-id="Ribbon-AlignCenter_MLR"]'
    ALIGN_LEFT_BUTTON = '[data-unique-id="Ribbon-AlignLeft_MLR"]'

    EXCEL_FONT_NAME_INPUT_ID = 'Ribbon-FontName_New-input'

    BOLD_BUTTON = '[data-unique-id="Ribbon-Bold"]'
    FONT_COLOR_DROPDOWN_BUTTON_CSS = '[data-unique-id="Ribbon-FontColor"]>span>button:nth-of-type(2)'
    FILL_COLOR_DROPDOWN_BUTTON_CSS = '[data-unique-id="Ribbon-FillColor"]>span>button:nth-of-type(2)'
    FONT_COLOR_BUTTON_CSS = '#Ribbon-FontColorDropdown button[aria-label="%s"]'
    FILL_COLOR_BUTTON_CSS = '#Ribbon-FillColorDropdown button[aria-label="%s"]'

    BUTTON_SELECTED_ARIA_VALUE = 'true'

    EXCEL_SELECTED_COLUMN_HEADER = '.ewrch-col-cellsel > .ewr-chc'
    EXCEL_SELECTED_ROW_HEADER = '.ewrch-row-cellsel > .ewr-rhc'
    EXCEL_ALL_COLUMN_HEADER_CSS = '.ewrch-col-cellsel > .ewr-chc, .ewrch-col-nosel  > .ewr-chc'
    EXCEL_ALL_ROW_HEADER_CSS = '.ewrch-row-cellsel > .ewr-rhc, .ewrch-row-nosel  > .ewr-rhc'

    RESIZE_WINDOW_CHOICE_FIELD_CSS = '.ms-ChoiceField:nth-of-type(%s) .ms-ChoiceField-field'
    RESIZE_WINDOW_SIZE_INPUT_ID = 'SizeInput'
    RESIZE_WINDOW_OK_BUTTON_ID = 'DialogActionButton'
    RESIZE_WINDOW_CANCEL_BUTTON_ID = 'DialogCancelButton'

    DEFAULT_UNIT = 'default'
    ALLOWED_UNITS = {
        'default': 1,
        'pixels': 2
    }

    RANGE_SEPARATOR = ':'

    def __init__(self):
        super().__init__()

        self.excel_menu_browser_page = ExcelMenuBrowserPage()

    @abstractmethod
    def hold_modifier_and_press_key(self, keys):
        pass

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
        self._select_cell_or_range(cell)

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
        self._select_cell_or_range(start_cell + ExcelSheetBrowserPage.RANGE_SEPARATOR + end_cell)

    def _select_cell_or_range(self, cells):
        self.excel_menu_browser_page.enable_use_of_keyboard_shortcuts()

        self.hold_modifier_and_press_key('g')  # open GO TO popup
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.hold_modifier_and_press_key('a')
        self.send_keys(cells)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.send_keys(Keys.ENTER)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

    def _get_selected_cell_value(self):
        self.hold_modifier_and_press_key('c')  # copy to clipboard
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        cell_value = paste()

        # adjust number formatting to account for other locales
        formatted_value = ExcelUtil.format_cell_value(cell_value)

        return formatted_value if formatted_value else ''

    def write_value_in_cell(self, cell, value):
        self.go_to_cell(cell)

        self.send_keys(value)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.send_keys(Keys.ENTER)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

    def get_number_of_worksheets(self):
        self.excel_menu_browser_page.enable_use_of_keyboard_shortcuts()

        self.hold_modifier_and_press_key('g')
        self.get_element_by_css(ExcelSheetBrowserPage.SHEET_DROPDOWN_BUTTON_CSS).click()
        number_of_worksheets = len(self.get_elements_by_css(ExcelSheetBrowserPage.WORKSHEETS_IN_GOTO_POPUP_SELECTOR))

        self.send_keys(Keys.ESCAPE)
        self.send_keys(Keys.ESCAPE)

        return number_of_worksheets

    def add_worksheet(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.ADD_SHEET_BUTTON).click()

    def open_worksheet(self, worksheet_number):
        self.focus_on_excel_frame()

        worksheet_number_int = int(worksheet_number) + 1

        self.get_element_by_css(ExcelSheetBrowserPage.SELECT_SHEET_BUTTON % worksheet_number_int).click()

    def remove_columns(self, first_column_to_be_deleted, number_of_columns_to_be_deleted):
        self.focus_on_excel_frame()

        self.go_to_cell(f'{first_column_to_be_deleted}1')

        for i in range(int(number_of_columns_to_be_deleted) - 1):
            self.hold_shift_and_press_keys(Keys.ARROW_RIGHT)  # extent selection by one cell to the right

            self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.hold_ctrl_and_press_keys(Keys.SPACE)  # select populated column part
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.hold_ctrl_and_press_keys(Keys.SPACE)  # select whole column
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.hold_modifier_and_press_key('-')  # remove current selection

    def click_table_design_tab(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.TABLE_DESIGN_TAB_ID).click()

    def click_green_table_style(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.GREEN_TABLE_STYLE_ID).click()

    def click_home_tab(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.TABLE_HOME_TAB).click()

    def click_percentage_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.PERCENTAGE_BUTTON_ID).click()

    def click_comma_style_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_id(ExcelSheetBrowserPage.COMMA_STYLE_BUTTON_ID).click()

    def click_align_middle_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.ALIGN_MIDDLE_BUTTON).click()

    def click_align_left_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.ALIGN_LEFT_BUTTON).click()

    def click_bold_button(self):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.BOLD_BUTTON).click()

    def set_font_color(self, font_color):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.FONT_COLOR_DROPDOWN_BUTTON_CSS).click()
        self.get_element_by_css(ExcelSheetBrowserPage.FONT_COLOR_BUTTON_CSS % font_color).click()

    def set_fill_color(self, fill_color):
        self.focus_on_excel_frame()

        self.get_element_by_css(ExcelSheetBrowserPage.FILL_COLOR_DROPDOWN_BUTTON_CSS).click()
        self.get_element_by_css(ExcelSheetBrowserPage.FILL_COLOR_BUTTON_CSS % fill_color).click()

    def is_fill_color_selected(self, cell_name, fill_color):
        self.go_to_cell(cell_name)

        self.get_element_by_css(ExcelSheetBrowserPage.FILL_COLOR_DROPDOWN_BUTTON_CSS).click()
        fill_color_element = self.get_element_by_css(ExcelSheetBrowserPage.FILL_COLOR_BUTTON_CSS % fill_color)
            
        return fill_color_element.get_attribute('aria-selected') == 'true'

    def change_font_name_of_cell(self, cell_name, font_name):
        self.go_to_cell(cell_name)

        self.get_element_by_id(ExcelSheetBrowserPage.EXCEL_FONT_NAME_INPUT_ID).click()
        self.press_backspace()
        self.send_keys(font_name)
        self.press_enter()

    def is_align_middle_button_selected(self, cell_name):
        return self._is_button_selected_by_css(cell_name, ExcelSheetBrowserPage.ALIGN_MIDDLE_BUTTON)

    def is_align_left_button_selected(self, cell_name):
        return self._is_button_selected_by_css(cell_name, ExcelSheetBrowserPage.ALIGN_LEFT_BUTTON)

    def is_bold_button_selected(self, cell_name):
        return self._is_button_selected_by_css(cell_name, ExcelSheetBrowserPage.BOLD_BUTTON)

    def _is_button_selected_by_css(self, cell_name, selector):
        self.go_to_cell(cell_name)

        formatting_button = self.get_element_by_css(selector)
        aria_attribute_value = formatting_button.get_attribute(ExcelSheetBrowserPage.ATTRIBUTE_NAME_ARIA_PRESSED)

        return aria_attribute_value == ExcelSheetBrowserPage.BUTTON_SELECTED_ARIA_VALUE

    def _is_button_selected(self, cell_name, selector):
        self.go_to_cell(cell_name)

        formatting_button = self.get_element_by_id(selector)
        aria_attribute_value = formatting_button.get_attribute(ExcelSheetBrowserPage.ATTRIBUTE_NAME_ARIA_PRESSED)

        return aria_attribute_value == ExcelSheetBrowserPage.BUTTON_SELECTED_ARIA_VALUE

    def is_font_color_selected(self, cell_name, font_color):
        self.go_to_cell(cell_name)

        self.get_element_by_css(ExcelSheetBrowserPage.FONT_COLOR_DROPDOWN_BUTTON_CSS).click()
        font_color_element = self.get_element_by_css(ExcelSheetBrowserPage.FONT_COLOR_BUTTON_CSS % font_color)
        
        return font_color_element.get_attribute('aria-selected') == 'true'

    def get_font_name_of_cell(self, cell_name):
        self.go_to_cell(cell_name)

        self.get_element_by_id(ExcelSheetBrowserPage.EXCEL_FONT_NAME_INPUT_ID).click()

        font_input = self.get_element_by_id(ExcelSheetBrowserPage.EXCEL_FONT_NAME_INPUT_ID)

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

    def hide_columns(self, column_names):
        self.focus_on_excel_frame()

        for column_name in column_names:
            self.go_to_cell(f'{column_name}1')
            self.hold_modifier_and_press_key('0')

    def hide_rows(self, row_names):
        self.focus_on_excel_frame()

        for row_name in row_names:
            self.go_to_cell(f'A{row_name}')
            self.hold_modifier_and_press_key('9')

    def resize_column(self, column_name, new_width, units=DEFAULT_UNIT):
        self.focus_on_excel_frame()

        self._open_resize_window_for_column(column_name)

        size_input = self._get_resize_window_input_with_selected_units(units)

        size_input.double_click()
        size_input.send_keys(new_width)

        self.get_element_by_id(ExcelSheetBrowserPage.RESIZE_WINDOW_OK_BUTTON_ID).click()

    def are_columns_hidden(self, column_names):
        self.focus_on_excel_frame()

        present_column_headers = self.get_elements_by_css(ExcelSheetBrowserPage.EXCEL_ALL_COLUMN_HEADER_CSS)
        present_column_names = map(lambda column: column.text, present_column_headers)

        return not any(column_name in column_names for column_name in present_column_names)

    def are_rows_hidden(self, row_names):
        self.focus_on_excel_frame()

        present_row_headers = self.get_elements_by_css(ExcelSheetBrowserPage.EXCEL_ALL_ROW_HEADER_CSS)
        present_row_names = map(lambda row: row.text, present_row_headers)

        return not any(row_name in row_names for row_name in present_row_names)

    def get_column_width(self, column_name, units=DEFAULT_UNIT):
        self.focus_on_excel_frame()

        self._open_resize_window_for_column(column_name)

        size_input = self._get_resize_window_input_with_selected_units(units)

        column_width = size_input.get_attribute(Const.ATTRIBUTE_VALUE)

        self.get_element_by_id(ExcelSheetBrowserPage.RESIZE_WINDOW_CANCEL_BUTTON_ID).click()

        return column_width

    def _open_resize_window_for_column(self, column_name):
        self.go_to_cell(f'{column_name}1')
        self.send_keys((Keys.ALT, 'h', 'o', 'w'))

    def _get_resize_window_input_with_selected_units(self, units):
        if units not in ExcelSheetBrowserPage.ALLOWED_UNITS:
            raise MstrException(f'Incorrect units parameter. Received: [{units}], '
                                f'allowed: {list(ExcelSheetBrowserPage.ALLOWED_UNITS.keys())}')

        units_list_element_no = ExcelSheetBrowserPage.ALLOWED_UNITS[units]

        self.get_element_by_css(ExcelSheetBrowserPage.RESIZE_WINDOW_CHOICE_FIELD_CSS % units_list_element_no).click()

        return self.get_element_by_id(ExcelSheetBrowserPage.RESIZE_WINDOW_SIZE_INPUT_ID)
