from pages.excel.excel_main.excel_main_mac_desktop_page import ExcelMainMacDesktopPage
from pages.excel.excel_menu.excel_menu_mac_desktop_page import ExcelMenuMacDesktopPage
from pages_base.base_page import BasePage


class StartExcelMacDesktopPage(BasePage):
    def __init__(self):
        super().__init__()

        self.excel_main_mac_desktop_page = ExcelMainMacDesktopPage()
        self.excel_menu_mac_desktop_page = ExcelMenuMacDesktopPage()

    def go_to_excel(self):
        self.excel_main_mac_desktop_page.click_new_blank_workbook_elem()
        self.excel_menu_mac_desktop_page.click_insert_tab_elem()
        self.excel_main_mac_desktop_page.click_add_in_drop_down_elem()
        self.excel_main_mac_desktop_page.click_first_add_in_to_import_elem()

    def maximize_excel_window(self):
        # TODO implement it?
        pass
