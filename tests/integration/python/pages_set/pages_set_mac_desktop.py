from pages.add_in_login.add_in_login_mac_desktop_page import AddInLoginMacDesktopPage
from pages.columns_and_filters_selection.attributes.columns_and_filters_selection_attributes_mac_desktop_page import \
    ColumnsAndFiltersSelectionAttributesMacDesktopPage
from pages.columns_and_filters_selection.columns_and_filters_selection_mac_desktop_page import \
    ColumnsAndFiltersSelectionMacDesktopPage
from pages.columns_and_filters_selection.display_attribute_form_names.display_attribute_form_names_mac_desktop_page \
    import DisplayAttributeFormNamesMacDesktopPage
from pages.columns_and_filters_selection.metrics.columns_and_filters_selection_metrics_mac_desktop_page import \
    ColumnsAndFiltersSelectionMetricsMacDesktopPage
from pages.excel.cleanup.cleanup_mac_desktop_page import CleanupMacDesktopPage
from pages.excel.excel_general.excel_general_mac_desktop_page import ExcelGeneralMacDesktopPage
from pages.excel.excel_menu.excel_menu_mac_desktop_page import ExcelMenuMacDesktopPage
from pages.excel.excel_sheet.excel_sheet_mac_desktop_page import ExcelSheetMacDesktopPage
from pages.import_data.import_data_mac_desktop_page import ImportDataMacDesktopPage
from pages.not_logged_right_panel.not_logged_right_panel_mac_desktop_page import NotLoggedRightPanelMacDesktopPage
from pages.right_panel.duplicate_object_popup.duplicate_object_popup_mac_desktop_page import \
    DuplicateObjectPopupMacDesktopPage
from pages.right_panel.range_taken_popup.range_taken_popup_mac_desktop_page import RangeTakenPopupMacDesktopPage
from pages.right_panel.right_panel_main.right_panel_main_mac_desktop_page import RightPanelMainMacDesktopPage
from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage
from pages_set.abstract_pages_set import AbstractPagesSet


class PagesSetMacDesktop(AbstractPagesSet):
    def __init__(self):
        super().__init__()

        self.excel_general_mac_desktop_page = ExcelGeneralMacDesktopPage()
        self.excel_menu_mac_desktop_page = ExcelMenuMacDesktopPage()
        self.excel_sheet_mac_desktop_page = ExcelSheetMacDesktopPage()

        self.add_in_login_mac_desktop_page = AddInLoginMacDesktopPage()
        self.cleanup_mac_desktop_page = CleanupMacDesktopPage()
        self.duplicate_object_popup_mac_desktop_page = DuplicateObjectPopupMacDesktopPage()
        self.filter_panel_mac_desktop_page = None
        self.import_data_mac_desktop_page = ImportDataMacDesktopPage()
        self.prompt_mac_desktop_page = None
        self.range_taken_popup_mac_desktop_page = RangeTakenPopupMacDesktopPage()

        self.not_logged_right_panel_mac_desktop_page = NotLoggedRightPanelMacDesktopPage()
        self.right_panel_mac_desktop_page = RightPanelMainMacDesktopPage()
        self.right_panel_tile_mac_desktop_page = RightPanelTileMacDesktopPage()
        self.right_panel_tile_details_mac_desktop_page = None

        self.columns_and_filters_selection_mac_desktop_page = ColumnsAndFiltersSelectionMacDesktopPage()
        self.columns_and_filters_selection_attributes_mac_desktop_page = \
            ColumnsAndFiltersSelectionAttributesMacDesktopPage()
        self.columns_and_filters_selection_metrics_mac_desktop_page = ColumnsAndFiltersSelectionMetricsMacDesktopPage()
        self.columns_and_filters_selection_filters_mac_desktop_page = None
        self.columns_and_filters_selection_list_header_mac_desktop_page = None
        self.display_attribute_form_names_mac_desktop_page = DisplayAttributeFormNamesMacDesktopPage()

        self.import_dossier_mac_desktop_page = None
        self.import_dossier_filter_mac_desktop_page = None
        self.import_dossier_bookmarks_mac_desktop_page = None
        self.import_dossier_table_of_contents_mac_desktop_page = None
        self.import_dossier_context_menu_mac_desktop_page = None
        self.import_dossier_show_data_mac_desktop_page = None

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

    def columns_and_filters_selection_attributes_page(self):
        return self.columns_and_filters_selection_attributes_mac_desktop_page

    def columns_and_filters_selection_metrics_page(self):
        return self.columns_and_filters_selection_metrics_mac_desktop_page

    def columns_and_filters_selection_filters_page(self):
        return self.columns_and_filters_selection_filters_mac_desktop_page

    def columns_and_filters_selection_list_header_page(self):
        return self.columns_and_filters_selection_list_header_mac_desktop_page

    def display_attribute_form_names_page(self):
        return self.display_attribute_form_names_mac_desktop_page

    def duplicate_object_popup_page(self):
        return self.duplicate_object_popup_mac_desktop_page

    def import_dossier_page(self):
        return self.import_dossier_mac_desktop_page

    def import_dossier_filter_page(self):
        return self.import_dossier_filter_mac_desktop_page

    def import_dossier_bookmarks_page(self):
        return self.import_dossier_bookmarks_mac_desktop_page

    def import_dossier_table_of_contents_page(self):
        return self.import_dossier_table_of_contents_mac_desktop_page

    def import_dossier_context_menu_page(self):
        return self.import_dossier_context_menu_mac_desktop_page

    def import_dossier_show_data_page(self):
        return self.import_dossier_show_data_mac_desktop_page

    def not_logged_right_panel_page(self):
        return self.not_logged_right_panel_mac_desktop_page

    def range_taken_popup_page(self):
        return self.range_taken_popup_mac_desktop_page

    def filter_panel_page(self):
        return self.filter_panel_mac_desktop_page

    def prompt_page(self):
        return self.prompt_mac_desktop_page

    def right_panel_tile_details_page(self):
        return self.right_panel_tile_details_mac_desktop_page
