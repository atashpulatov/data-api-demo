from pages.add_in_login.add_in_login_browser_page import AddInLoginBrowserPage
from pages.columns_and_filters_selection.columns_and_filters_selection_browser_page import \
    ColumnsAndFiltersSelectionBrowserPage
from pages.duplicate_object_popup.duplicate_object_popup_browser_page import DuplicateObjectPopupBrowserPage
from pages.excel.cleanup.cleanup_browser_page import CleanupBrowserPage
from pages.excel.excel_menu.excel_menu_browser_page import ExcelMenuBrowserPage
from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage
from pages.excel.start_excel.start_excel_browser_page import StartExcelBrowserPage
from pages.import_data_popup.import_data_popup_browser_page import ImportDataPopupBrowserPage
from pages.import_dossier.import_dossier.import_dossier_browser_page import ImportDossierBrowserPage
from pages.import_dossier.import_dossier_bookmarks.import_dossier_bookmarks_browser_page import \
    ImportDossierBookmarksBrowserPage
from pages.import_dossier.import_dossier_context_menu.import_dossier_context_menu_browser_page import \
    ImportDossierContextMenuBrowserPage
from pages.import_dossier.import_dossier_filter.import_dossier_filter_browser_page import ImportDossierFilterBrowserPage
from pages.import_dossier.import_dossier_show_data.import_dossier_show_data_browser_page import \
    ImportDossierShowDataBrowserPage
from pages.import_dossier.import_dossier_table_of_contents.import_dossier_table_of_contents_browser_page import \
    ImportDossierTableOfContentsBrowserPage
from pages.not_logged_right_panel.not_logged_right_panel_browser_page import NotLoggedRightPanelBrowserPage
from pages.right_panel.range_taken_popup.range_taken_popup_browser_page import RangeTakenPopupBrowserPage
from pages.right_panel.right_panel.right_panel_browser_page import RightPanelBrowserPage
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
from pages_set.abstract_pages_set import AbstractPagesSet


class PagesSetBrowser(AbstractPagesSet):
    def __init__(self):
        super().__init__()

        self.start_excel_browser_page = StartExcelBrowserPage()
        self.add_in_login_browser_page = AddInLoginBrowserPage()
        self.excel_menu_browser_page = ExcelMenuBrowserPage()
        self.cleanup_browser_page = CleanupBrowserPage()
        self.right_panel_browser_page = RightPanelBrowserPage()
        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()
        self.import_data_popup_browser_page = ImportDataPopupBrowserPage()
        self.excel_sheet_browser_page = ExcelSheetBrowserPage()
        self.columns_and_filters_selection_browser_page = ColumnsAndFiltersSelectionBrowserPage()
        self.duplicate_object_popup_browser_page = DuplicateObjectPopupBrowserPage()
        self.import_dossier_browser_page = ImportDossierBrowserPage()
        self.import_dossier_filter_browser_page = ImportDossierFilterBrowserPage()
        self.import_dossier_bookmarks_browser_page = ImportDossierBookmarksBrowserPage()
        self.import_dossier_table_of_contents_browser_page = ImportDossierTableOfContentsBrowserPage()
        self.import_dossier_context_menu_browser_page = ImportDossierContextMenuBrowserPage()
        self.import_dossier_show_data_browser_page = ImportDossierShowDataBrowserPage()
        self.not_logged_right_panel_browser_page = NotLoggedRightPanelBrowserPage()
        self.range_taken_popup_browser_page = RangeTakenPopupBrowserPage()

    def start_excel_page(self):
        return self.start_excel_browser_page

    def add_in_login_page(self):
        return self.add_in_login_browser_page

    def excel_menu_page(self):
        return self.excel_menu_browser_page

    def cleanup_page(self):
        return self.cleanup_browser_page

    def right_panel_page(self):
        return self.right_panel_browser_page

    def right_panel_tile_page(self):
        return self.right_panel_tile_browser_page

    def import_data_popup_page(self):
        return self.import_data_popup_browser_page

    def excel_sheet_page(self):
        return self.excel_sheet_browser_page

    def columns_and_filters_selection_page(self):
        return self.columns_and_filters_selection_browser_page

    def duplicate_object_popup_page(self):
        return self.duplicate_object_popup_browser_page

    def import_dossier_page(self):
        return self.import_dossier_browser_page

    def import_dossier_filter_page(self):
        return self.import_dossier_filter_browser_page

    def import_dossier_bookmarks_page(self):
        return self.import_dossier_bookmarks_browser_page

    def import_dossier_table_of_contents_page(self):
        return self.import_dossier_table_of_contents_browser_page

    def import_dossier_context_menu_page(self):
        return self.import_dossier_context_menu_browser_page

    def import_dossier_show_data_page(self):
        return self.import_dossier_show_data_browser_page

    def not_logged_right_panel_page(self):
        return self.not_logged_right_panel_browser_page

    def range_taken_popup_page(self):
        return self.range_taken_popup_browser_page
