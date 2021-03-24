from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage
from pyperclip import paste

from selenium.webdriver.common.keys import Keys

from framework.util.excel_util import ExcelUtil
from framework.util.const import Const



class ExcelSheetWindowsChromePage(ExcelSheetBrowserPage):

    def remove_columns(self, first_column_to_be_deleted, number_of_columns_to_be_deleted):
        self.focus_on_excel_frame()

        self.go_to_cell('%s1' % first_column_to_be_deleted)

        for i in range(0, int(number_of_columns_to_be_deleted)-1):
          self.hold_shift_and_press_keys(Keys.ARROW_RIGHT) # extent selection by one cell to the right

          self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        for _ in range(2):
          self.hold_ctrl_and_press_keys(Keys.SPACE) # 1. select populated column part / 2. select whole column 
          self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.hold_ctrl_and_press_keys("-") # remove current selection

    def get_selected_cell_value(self):
 
        self.hold_ctrl_and_press_keys("c") # copy to clipboard
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        cell_value = paste()
        formatted_value = ExcelUtil.format_cell_value(cell_value)

        return formatted_value if formatted_value else ''

    def select_cell_or_range(self, cells):
        self.excel_menu_browser_page.enable_use_of_keyboard_shortcuts()

        self.hold_ctrl_and_press_keys("g") # open GO TO popup
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.send_keys(cells)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.send_keys(Keys.ENTER)
        self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

    def get_number_of_worksheets(self):
        self.focus_on_excel_frame()

        self.hold_ctrl_and_press_keys("g")

        return len(self.get_elements_by_css(ExcelSheetBrowserPage.WORKSHEETS_IN_GOTO_POPUP_SELECTOR))
