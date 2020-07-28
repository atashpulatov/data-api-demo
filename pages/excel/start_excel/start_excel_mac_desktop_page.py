from pages.excel.excel_main.excel_main_mac_desktop_page import ExcelMainMacDesktopPage
from pages_base.base_page import BasePage


class StartExcelMacDesktopPage(BasePage):
    def __init__(self):
        super().__init__()

        self.excel_main_mac_desktop_page = ExcelMainMacDesktopPage()

    def go_to_excel(self):
        self.excel_main_mac_desktop_page.click_new_blank_workbook_elem()
        self.excel_main_mac_desktop_page.click_insert_tab_elem()
        self.excel_main_mac_desktop_page.click_add_in_drop_down_elem()
        self.excel_main_mac_desktop_page.click_first_add_in_to_import_elem()

    def maximize_excel_window(self):
        # TODO implement it?
        pass
