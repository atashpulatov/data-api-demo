from abc import ABC, abstractmethod

from pages.development.development_page import DevelopmentPage


class AbstractPages(ABC):
    def __init__(self):
        self.development_common_page = DevelopmentPage()

    @abstractmethod
    def start_excel_page(self):
        pass

    @abstractmethod
    def add_in_login_page(self):
        pass

    @abstractmethod
    def excel_menu_page(self):
        pass

    @abstractmethod
    def cleanup_page(self):
        pass

    @abstractmethod
    def right_panel_page(self):
        pass

    @abstractmethod
    def right_panel_tile_page(self):
        pass

    @abstractmethod
    def import_data_popup_page(self):
        pass

    @abstractmethod
    def excel_sheet_page(self):
        pass

    @abstractmethod
    def columns_and_filters_selection_page(self):
        pass

    @abstractmethod
    def duplicate_object_popup_page(self):
        pass

    @abstractmethod
    def import_dossier_page(self):
        pass

    @abstractmethod
    def import_dossier_filter_page(self):
        pass

    @abstractmethod
    def import_dossier_bookmarks_page(self):
        pass

    @abstractmethod
    def import_dossier_table_of_contents_page(self):
        pass

    @abstractmethod
    def import_dossier_context_menu_page(self):
        pass

    @abstractmethod
    def import_dossier_show_data_page(self):
        pass

    def development_page(self):
        return self.development_common_page
