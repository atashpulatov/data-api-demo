from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage


class ExcelSheetMacChromePage(ExcelSheetBrowserPage):
    def hold_modifier_and_press_key(self, keys):
        self.hold_command_and_press_keys(keys)
