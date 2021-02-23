from abc import ABC, abstractmethod

from pages.api.rest_api_page import RestApiPage
from pages.debug.debug_page import DebugPage
from pages.excel.excel_initialize.excel_initialize_page import ExcelInitializePage
from pages.keyboard.keyboard_page import KeyboardPage
from pages.time_duration.time_duration_page import TimeDurationPage


class AbstractPagesSet(ABC):
    def __init__(self):
        self.debug_common_page = DebugPage()
        self.keyboard_common_page = KeyboardPage()
        self.rest_api_common_page = RestApiPage()
        self.time_duration_common_page = TimeDurationPage()
        self.excel_initialize_common_page = ExcelInitializePage()

    def debug_page(self):
        return self.debug_common_page

    def keyboard_page(self):
        return self.keyboard_common_page

    def rest_api_page(self):
        return self.rest_api_common_page

    def time_duration_page(self):
        return self.time_duration_common_page

    def excel_initialize_page(self):
        return self.excel_initialize_common_page

    @abstractmethod
    def excel_general_page(self):
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
    def columns_and_filters_selection_attributes_page(self):
        pass

    @abstractmethod
    def columns_and_filters_selection_metrics_page(self):
        pass

    @abstractmethod
    def columns_and_filters_selection_filters_page(self):
        pass

    @abstractmethod
    def columns_and_filters_selection_list_header_page(self):
        pass

    @abstractmethod
    def display_attribute_form_names_page(self):
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
