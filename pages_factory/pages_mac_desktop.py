from pages.add_in_login.add_in_login_mac_desktop_page import AddInLoginMacDesktopPage
from pages.excel.excel_close.excel_close_mac_desktop_page import CleanupMacDesktopPage
from pages.excel.excel_menu.excel_menu_mac_desktop_page import ExcelMenuMacDesktopPage
from pages.excel.excel_sheet.excel_sheet_mac_desktop_page import ExcelSheetMacDesktopPage
from pages.excel.start_excel.start_excel_mac_desktop_page import StartExcelMacDesktopPage
from pages.import_data_popup.import_data_popup_mac_desktop_page import ImportDataPopupMacDesktopPage
from pages.right_panel.right_panel_mac_desktop_page import RightPanelMacDesktopPage
from pages_factory.abstract_pages import AbstractPages


class PagesMacDesktop(AbstractPages):
    def __init__(self):
        super().__init__()

        self.start_excel_mac_desktop_page = StartExcelMacDesktopPage()
        self.add_in_login_mac_desktop_page = AddInLoginMacDesktopPage()
        self.excel_menu_mac_desktop_page = ExcelMenuMacDesktopPage()
        self.cleanup_mac_desktop_page = CleanupMacDesktopPage()
        self.right_panel_mac_desktop_page = RightPanelMacDesktopPage()
        self.import_data_popup_mac_desktop_page = ImportDataPopupMacDesktopPage()
        self.excel_sheet_mac_desktop_page = ExcelSheetMacDesktopPage()

    def start_excel_page(self):
        return self.start_excel_mac_desktop_page

    def add_in_login_page(self):
        return self.add_in_login_mac_desktop_page

    def excel_menu_page(self):
        return self.excel_menu_mac_desktop_page

    def cleanup_page(self):
        return self.cleanup_mac_desktop_page

    def right_panel_page(self):
        return self.right_panel_mac_desktop_page

    def import_data_popup_page(self):
        return self.import_data_popup_mac_desktop_page

    def excel_sheet_page(self):
        return self.excel_sheet_mac_desktop_page

    def columns_and_filters_selection_page(self):
        return None

    def duplicate_object_popup_page(self):
        return None
