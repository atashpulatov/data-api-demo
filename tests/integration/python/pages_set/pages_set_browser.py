from pages.add_in_login.add_in_login_browser_page import AddInLoginBrowserPage
from pages.columns_and_filters_selection.attributes.columns_and_filters_selection_attributes_browser_page import \
    ColumnsAndFiltersSelectionAttributesBrowserPage
from pages.columns_and_filters_selection.columns_and_filters_selection_browser_page import \
    ColumnsAndFiltersSelectionBrowserPage
from pages.columns_and_filters_selection.display_attribute_form_names.display_attribute_form_names_browser_page import \
    DisplayAttributeFormNamesBrowserPage
from pages.columns_and_filters_selection.filters.columns_and_filters_selection_filters_browser_page \
    import ColumnsAndFiltersSelectionFiltersBrowserPage
from pages.columns_and_filters_selection.list_header.columns_and_filters_selection_list_header_browser_page \
    import ColumnsAndFiltersSelectionListHeaderBrowserPage
from pages.columns_and_filters_selection.metrics.columns_and_filters_selection_metrics_browser_page \
    import ColumnsAndFiltersSelectionMetricsBrowserPage
from pages.excel.cleanup.cleanup_browser_page import CleanupBrowserPage
from pages.excel.excel_general.excel_general_browser_page import ExcelGeneralBrowserPage
from pages.excel.excel_menu.excel_menu_browser_page import ExcelMenuBrowserPage
from pages.filter_panel.filter_panel_browser_page import FilterPanelBrowserPage
from pages.import_data.import_data_browser_page import ImportDataBrowserPage
from pages.import_dossier.import_dossier_bookmarks.import_dossier_bookmarks_browser_page import \
    ImportDossierBookmarksBrowserPage
from pages.import_dossier.import_dossier_context_menu.import_dossier_context_menu_browser_page import \
    ImportDossierContextMenuBrowserPage
from pages.import_dossier.import_dossier_filter.import_dossier_filter_browser_page import ImportDossierFilterBrowserPage
from pages.import_dossier.import_dossier_main.import_dossier_main_browser_page import ImportDossierMainBrowserPage
from pages.import_dossier.import_dossier_show_data.import_dossier_show_data_browser_page import \
    ImportDossierShowDataBrowserPage
from pages.import_dossier.import_dossier_table_of_contents.import_dossier_table_of_contents_browser_page import \
    ImportDossierTableOfContentsBrowserPage
from pages.not_logged_right_panel.not_logged_right_panel_browser_page import NotLoggedRightPanelBrowserPage
from pages.prompt.prompt_browser_page import PromptBrowserPage
from pages.right_panel.duplicate_object_popup.duplicate_object_popup_browser_page import DuplicateObjectPopupBrowserPage
from pages.right_panel.range_taken_popup.range_taken_popup_browser_page import RangeTakenPopupBrowserPage
from pages.right_panel.right_panel_main.right_panel_main_browser_page import RightPanelMainBrowserPage
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
from pages.right_panel.right_panel_tile_details.right_panel_tile_details_browser_page import \
    RightPanelTileDetailsBrowserPage
from pages.ub_performance.import_ub_performance_browser import UbPerformancePage
from pages_set.abstract_pages_set import AbstractPagesSet


class PagesSetBrowser(AbstractPagesSet):
    def __init__(self):
        super().__init__()

        self.excel_general_browser_page = ExcelGeneralBrowserPage()
        self.excel_menu_browser_page = ExcelMenuBrowserPage()

        self.add_in_login_browser_page = AddInLoginBrowserPage()
        self.cleanup_browser_page = CleanupBrowserPage()
        self.duplicate_object_popup_browser_page = DuplicateObjectPopupBrowserPage()
        self.filter_panel_browser_page = FilterPanelBrowserPage()
        self.import_data_browser_page = ImportDataBrowserPage()
        self.prompt_browser_page = PromptBrowserPage()
        self.range_taken_popup_browser_page = RangeTakenPopupBrowserPage()

        self.not_logged_right_panel_browser_page = NotLoggedRightPanelBrowserPage()
        self.right_panel_browser_page = RightPanelMainBrowserPage()
        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()
        self.right_panel_tile_details_browser_page = RightPanelTileDetailsBrowserPage()

        self.columns_and_filters_selection_browser_page = ColumnsAndFiltersSelectionBrowserPage()
        self.columns_and_filters_selection_attributes_browser_page = ColumnsAndFiltersSelectionAttributesBrowserPage()
        self.columns_and_filters_selection_metrics_browser_page = ColumnsAndFiltersSelectionMetricsBrowserPage()
        self.columns_and_filters_selection_filters_browser_page = ColumnsAndFiltersSelectionFiltersBrowserPage()
        self.columns_and_filters_selection_list_header_browser_page = ColumnsAndFiltersSelectionListHeaderBrowserPage()
        self.display_attribute_form_names_browser_page = DisplayAttributeFormNamesBrowserPage()

        self.import_dossier_browser_page = ImportDossierMainBrowserPage()
        self.import_dossier_filter_browser_page = ImportDossierFilterBrowserPage()
        self.import_dossier_bookmarks_browser_page = ImportDossierBookmarksBrowserPage()
        self.import_dossier_table_of_contents_browser_page = ImportDossierTableOfContentsBrowserPage()
        self.import_dossier_context_menu_browser_page = ImportDossierContextMenuBrowserPage()
        self.import_dossier_show_data_browser_page = ImportDossierShowDataBrowserPage()

        self.import_ub_performance_browser_page = UbPerformancePage()

    def excel_general_page(self):
        return self.excel_general_browser_page

    def excel_menu_page(self):
        return self.excel_menu_browser_page

    def add_in_login_page(self):
        return self.add_in_login_browser_page

    def cleanup_page(self):
        return self.cleanup_browser_page

    def duplicate_object_popup_page(self):
        return self.duplicate_object_popup_browser_page

    def filter_panel_page(self):
        return self.filter_panel_browser_page

    def import_data_page(self):
        return self.import_data_browser_page

    def prompt_page(self):
        return self.prompt_browser_page

    def range_taken_popup_page(self):
        return self.range_taken_popup_browser_page

    def not_logged_right_panel_page(self):
        return self.not_logged_right_panel_browser_page

    def right_panel_page(self):
        return self.right_panel_browser_page

    def right_panel_tile_page(self):
        return self.right_panel_tile_browser_page

    def right_panel_tile_details_page(self):
        return self.right_panel_tile_details_browser_page

    def columns_and_filters_selection_page(self):
        return self.columns_and_filters_selection_browser_page

    def columns_and_filters_selection_attributes_page(self):
        return self.columns_and_filters_selection_attributes_browser_page

    def columns_and_filters_selection_metrics_page(self):
        return self.columns_and_filters_selection_metrics_browser_page

    def columns_and_filters_selection_filters_page(self):
        return self.columns_and_filters_selection_filters_browser_page

    def columns_and_filters_selection_list_header_page(self):
        return self.columns_and_filters_selection_list_header_browser_page

    def display_attribute_form_names_page(self):
        return self.display_attribute_form_names_browser_page

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

    def import_ub_performance_page(self):
        return self.import_ub_performance_browser_page
