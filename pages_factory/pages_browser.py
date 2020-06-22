from pages.add_in_login.add_in_login_browser_page import AddInLoginBrowserPage
from pages.columns_and_filters_selection.columns_and_filters_selection_browser_page import \
    ColumnsAndFiltersSelectionBrowserPage
from pages.duplicate_object_popup.duplicate_object_popup_browser_page import DuplicateObjectPopupBrowserPage
from pages.excel.excel_close.excel_close_browser_page import CleanupBrowserPage
from pages.excel.excel_menu.excel_menu_browser_page import ExcelMenuBrowserPage
from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage
from pages.excel.start_excel.start_excel_browser_page import StartExcelBrowserPage
from pages.import_data_popup.import_data_popup_browser_page import ImportDataPopupBrowserPage
from pages.import_dossier.import_dossier_browser_page import ImportDossierBrowserPage
from pages.right_panel.right_panel_browser_page import RightPanelBrowserPage
from pages_factory.abstract_pages import AbstractPages


class PagesBrowser(AbstractPages):
    def __init__(self):
        super().__init__()

        self.start_excel_browser_page = StartExcelBrowserPage()
        self.add_in_login_browser_page = AddInLoginBrowserPage()
        self.excel_menu_browser_page = ExcelMenuBrowserPage()
        self.cleanup_browser_page = CleanupBrowserPage()
        self.right_panel_browser_page = RightPanelBrowserPage()
        self.import_data_popup_browser_page = ImportDataPopupBrowserPage()
        self.excel_sheet_browser_page = ExcelSheetBrowserPage()
        self.columns_and_filters_selection_browser_page = ColumnsAndFiltersSelectionBrowserPage()
        self.duplicate_object_popup_browser_page = DuplicateObjectPopupBrowserPage()
        self.import_dossier_browser_page = ImportDossierBrowserPage()

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
