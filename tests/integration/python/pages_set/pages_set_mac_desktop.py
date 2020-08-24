from pages.add_in_login.add_in_login_mac_desktop_page import AddInLoginMacDesktopPage
from pages.columns_and_filters_selection.columns_and_filters_selection_mac_desktop_page import \
    ColumnsAndFiltersSelectionMacDesktopPage
from pages.excel.cleanup.cleanup_mac_desktop_page import CleanupMacDesktopPage
from pages.excel.excel_menu.excel_menu_mac_desktop_page import ExcelMenuMacDesktopPage
from pages.excel.excel_sheet.excel_sheet_mac_desktop_page import ExcelSheetMacDesktopPage
from pages.excel.excel_general.excel_general_mac_desktop_page import ExcelGeneralMacDesktopPage
from pages.import_data.import_data_mac_desktop_page import ImportDataMacDesktopPage
from pages.not_logged_right_panel.not_logged_right_panel_mac_desktop_page import NotLoggedRightPanelMacDesktopPage
from pages.right_panel.duplicate_object_popup.duplicate_object_popup_mac_desktop_page import \
    DuplicateObjectPopupMacDesktopPage
from pages.right_panel.right_panel_main.right_panel_main_mac_desktop_page import RightPanelMainMacDesktopPage
from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage
from pages_set.abstract_pages_set import AbstractPagesSet


class PagesSetMacDesktop(AbstractPagesSet):
    def __init__(self):
        super().__init__()
        self.excel_general_mac_desktop_page = ExcelGeneralMacDesktopPage()
        self.add_in_login_mac_desktop_page = AddInLoginMacDesktopPage()
        self.excel_menu_mac_desktop_page = ExcelMenuMacDesktopPage()
        self.cleanup_mac_desktop_page = CleanupMacDesktopPage()
        self.right_panel_mac_desktop_page = RightPanelMainMacDesktopPage()
        self.right_panel_tile_mac_desktop_page = RightPanelTileMacDesktopPage()
        self.import_data_mac_desktop_page = ImportDataMacDesktopPage()
        self.excel_sheet_mac_desktop_page = ExcelSheetMacDesktopPage()
        self.duplicate_object_popup_mac_desktop_page = DuplicateObjectPopupMacDesktopPage()
        self.not_logged_right_panel_mac_desktop_page = NotLoggedRightPanelMacDesktopPage()
        self.columns_and_filters_selection_mac_desktop_page = ColumnsAndFiltersSelectionMacDesktopPage()

    def excel_general_page(self):
        return self.excel_general_mac_desktop_page

    def add_in_login_page(self):
        return self.add_in_login_mac_desktop_page

    def excel_menu_page(self):
        return self.excel_menu_mac_desktop_page

    def cleanup_page(self):
        return self.cleanup_mac_desktop_page

    def right_panel_page(self):
        return self.right_panel_mac_desktop_page

    def right_panel_tile_page(self):
        return self.right_panel_tile_mac_desktop_page

    def import_data_page(self):
        return self.import_data_mac_desktop_page

    def excel_sheet_page(self):
        return self.excel_sheet_mac_desktop_page

    def columns_and_filters_selection_page(self):
        return self.columns_and_filters_selection_mac_desktop_page

    def duplicate_object_popup_page(self):
        return self.duplicate_object_popup_mac_desktop_page

    def import_dossier_page(self):
        pass

    def import_dossier_filter_page(self):
        pass

    def import_dossier_bookmarks_page(self):
        pass

    def import_dossier_table_of_contents_page(self):
        pass

    def import_dossier_context_menu_page(self):
        pass

    def import_dossier_show_data_page(self):
        pass

    def not_logged_right_panel_page(self):
        return self.not_logged_right_panel_mac_desktop_page

    def range_taken_popup_page(self):
        pass

    def filter_panel_page(self):
        pass

    def prompt_page(self):
        pass

    def right_panel_tile_details_page(self):
        pass
