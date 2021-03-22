from pages.excel.excel_sheet.excel_sheet_windows_chrome_page import ExcelSheetWindowsChromePage
from pages_set.pages_set_browser import PagesSetBrowser


class PagesSetWindowsChrome(PagesSetBrowser):
    def __init__(self):
        super().__init__()

        self.excel_sheet_windows_chrome_page = ExcelSheetWindowsChromePage()

    def excel_sheet_page(self):
        return self.excel_sheet_windows_chrome_page
