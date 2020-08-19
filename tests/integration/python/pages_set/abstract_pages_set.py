from abc import ABC, abstractmethod

from pages.debug.debug_page import DebugPage
from pages.keyboard.keyboard_page import KeyboardPage


class AbstractPagesSet(ABC):
    def __init__(self):
        self.debug_common_page = DebugPage()
        self.keyboard_common_page = KeyboardPage()

    def debug_page(self):
        return self.debug_common_page

    def keyboard_page(self):
        return self.keyboard_common_page

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
    def import_data_page(self):
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

    @abstractmethod
    def not_logged_right_panel_page(self):
        pass

    @abstractmethod
    def range_taken_popup_page(self):
        pass

    @abstractmethod
    def filter_panel_page(self):
        pass

    @abstractmethod
    def prompt_page(self):
        pass

    @abstractmethod
    def right_panel_tile_details_page(self):
        pass
