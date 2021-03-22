from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains


from framework.util.const import Const

class ExcelSheetMacChromePage(ExcelSheetBrowserPage):

    def remove_columns(self, first_column_to_be_deleted, number_of_columns_to_be_deleted):
        self.focus_on_excel_frame()

        self.go_to_cell('%s1' % first_column_to_be_deleted)

        for i in range(0, int(number_of_columns_to_be_deleted)-1):
          self.hold_shift_and_press_keys(Keys.ARROW_RIGHT) # extent selection by one cell to the right

          self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        for _ in range(2):
          self.hold_ctrl_and_press_keys(Keys.SPACE) # 1. select populated column part / 2. select whole column 
          self.pause(Const.DEFAULT_WAIT_AFTER_SEND_KEY)

        self.hold_command_and_press_keys("-") # remove current selection

