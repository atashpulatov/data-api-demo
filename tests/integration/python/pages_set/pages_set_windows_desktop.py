from pages.add_in_login.add_in_login_windows_desktop_page import AddInLoginWindowsDesktopPage
from pages.columns_and_filters_selection.columns_and_filters_selection_windows_desktop_page import \
    ColumnsAndFiltersSelectionWindowsDesktopPage
from pages.excel.cleanup.cleanup_windows_desktop_page import CleanupWindowsDesktopPage
from pages.excel.excel_menu.excel_menu_windows_desktop_page import ExcelMenuWindowsDesktopPage
from pages.excel.excel_sheet.excel_sheet_windows_desktop_page import ExcelSheetWindowsDesktopPage
from pages.excel.excel_general.excel_general_windows_desktop_page import ExcelGeneralWindowsDesktopPage
from pages.import_data.import_data_windows_desktop_page import ImportDataWindowsDesktopPage
from pages.import_dossier.import_dossier_main.import_dossier_main_windows_desktop_page import \
    ImportDossierMainWindowsDesktopPage
from pages.not_logged_right_panel.not_logged_right_panel_windows_desktop_page import \
    NotLoggedRightPanelWindowsDesktopPage
from pages.right_panel.duplicate_object_popup.duplicate_object_popup_windows_desktop_page import \
    DuplicateObjectPopupWindowsDesktopPage
from pages.right_panel.right_panel_main.right_panel_main_windows_desktop_page import RightPanelMainWindowsDesktopPage
from pages.right_panel.right_panel_tile.right_panel_tile_windows_desktop_page import RightPanelTileWindowsDesktopPage
from pages_set.abstract_pages_set import AbstractPagesSet
from pages.right_panel.range_taken_popup.range_taken_popup_windows_desktop_page import RangeTakenPopupWindowsDesktopPage


class PagesSetWindowsDesktop(AbstractPagesSet):
    def __init__(self):
        super().__init__()

        self.excel_general_windows_desktop_page = ExcelGeneralWindowsDesktopPage()
        self.add_in_login_windows_desktop_page = AddInLoginWindowsDesktopPage()
        self.excel_menu_windows_desktop_page = ExcelMenuWindowsDesktopPage()
        self.cleanup_windows_desktop_page = CleanupWindowsDesktopPage()
        self.right_panel_windows_desktop_page = RightPanelMainWindowsDesktopPage()
        self.right_panel_tile_windows_desktop_page = RightPanelTileWindowsDesktopPage()
        self.import_data_windows_desktop_page = ImportDataWindowsDesktopPage()
        self.excel_sheet_windows_desktop_page = ExcelSheetWindowsDesktopPage()
        self.duplicate_object_popup_windows_desktop_page = DuplicateObjectPopupWindowsDesktopPage()
        self.columns_and_filters_selection_browser_page = ColumnsAndFiltersSelectionWindowsDesktopPage()
        self.import_dossier_windows_desktop_page = ImportDossierMainWindowsDesktopPage()
        self.not_logged_right_panel_windows_desktop_page = NotLoggedRightPanelWindowsDesktopPage()
        self.range_taken_popup_windows_desktop_page = RangeTakenPopupWindowsDesktopPage()

    def excel_general_page(self):
        return self.excel_general_windows_desktop_page

    def add_in_login_page(self):
        return self.add_in_login_windows_desktop_page

    def excel_menu_page(self):
        return self.excel_menu_windows_desktop_page

    def cleanup_page(self):
        return self.cleanup_windows_desktop_page

    def right_panel_page(self):
        return self.right_panel_windows_desktop_page

    def right_panel_tile_page(self):
        return self.right_panel_tile_windows_desktop_page

    def import_data_page(self):
        return self.import_data_windows_desktop_page

    def excel_sheet_page(self):
        return self.excel_sheet_windows_desktop_page

    def columns_and_filters_selection_page(self):
        return self.columns_and_filters_selection_browser_page

    def duplicate_object_popup_page(self):
        return self.duplicate_object_popup_windows_desktop_page

    def import_dossier_page(self):
        return self.import_dossier_windows_desktop_page

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
        return self.not_logged_right_panel_windows_desktop_page

    def range_taken_popup_page(self):
        return self.range_taken_popup_windows_desktop_page

    def filter_panel_page(self):
        pass

    def prompt_page(self):
        pass

    def right_panel_tile_details_page(self):
        pass
