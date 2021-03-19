from pages.excel.excel_sheet.excel_sheet_mac_chrome_page import ExcelSheetMacChromePage
from pages_set.pages_set_browser import PagesSetBrowser


class PagesSetMacChrome(PagesSetBrowser):
    def __init__(self):
        super().__init__()

        self.excel_sheet_mac_chrome_page = ExcelSheetMacChromePage()

    def excel_sheet_page(self):
        return self.excel_sheet_mac_chrome_page
